import os
from flask import Flask, send_from_directory
from dash import Dash, html, dcc, dash_table, Input, Output, State
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import pandas as pd
from data_loader import load_historical_results, load_latest_test
from visualizations import pie_chart, step_execution_chart, historical_test_trend, failure_bar_chart, error_frequency_heatmap
from chatgpt_integration import extract_errors, extract_relevant_code, analyze_errors_with_chatgpt

# Initialize Flask server for serving images
server = Flask(__name__)
app = Dash(__name__, external_stylesheets=[dbc.themes.FLATLY], suppress_callback_exceptions=True, server=server)

# Load data
latest_test_summary, latest_test_steps = load_latest_test()
historical_summary, historical_steps = load_historical_results()

# Extract ChatGPT Analysis
extracted_errors = extract_errors()
relevant_code = extract_relevant_code(extracted_errors)
chatgpt_analysis = analyze_errors_with_chatgpt(extracted_errors, relevant_code)

# Compute success/failure counts per step for Historical Data Tab
historical_step_counts = historical_steps.groupby('StepName').agg({'Status': ['count']}).reset_index()
historical_step_counts.columns = ['Step Name', 'Total Runs']
#historical_step_counts['Success Count'] = historical_steps[historical_steps['Status'] == 'Passed'].groupby('StepName').size().reindex(historical_step_counts['Step Name'], fill_value=0).values
historical_step_counts['Failure Count'] = historical_steps[historical_steps['Status'] == 'Failed'].groupby('StepName').size().reindex(historical_step_counts['Step Name'], fill_value=0).values

# Define screenshot directory
screenshot_dir = r"C:\\Users\\jeena\\SeleniumAutomation\\AutomationScript\\Results"

@server.route("/screenshots/<path:filename>")
def serve_screenshot(filename):
    return send_from_directory(screenshot_dir, filename)

def get_screenshot_paths():
    """Fetch list of screenshots from the results directory."""
    if os.path.exists(screenshot_dir):
        images = [f"/screenshots/{img}" for img in os.listdir(screenshot_dir) if img.endswith(('png', 'jpg', 'jpeg'))]
        return images if images else ['https://via.placeholder.com/750x500?text=No+Screenshots+Available']
    return ['https://via.placeholder.com/750x500?text=No+Screenshots+Available']

screenshot_paths = get_screenshot_paths()

# Layout structure
app.layout = dbc.Container([
    dbc.Navbar(
        dbc.Container([
            dbc.Row([
                dbc.Col(html.H2("Test Results Dashboard", className="text-light fw-bold")),
            ], align="center"),
        ], fluid=True),
        color="dark", dark=True, className="mb-4 shadow-sm"
    ),
    
    dbc.Tabs(id='tabs', active_tab='current-run', children=[
        dbc.Tab(label='Current Run', tab_id='current-run', tab_style={"font-size": "18px"}, active_tab_style={"font-weight": "bold"}),
        dbc.Tab(label='Historical Data', tab_id='historical-data', tab_style={"font-size": "18px"}, active_tab_style={"font-weight": "bold"}),
        dbc.Tab(label='ChatGPT Analysis', tab_id='chatgpt-analysis', tab_style={"font-size": "18px"}, active_tab_style={"font-weight": "bold"})
    ], className="mb-4"),
    
    dcc.Interval(id='interval-component', interval=100, n_intervals=0),
    html.Div(id='tabs-content')
], fluid=True, className="p-4 bg-light shadow-lg rounded")

# Tab Content Callback
@app.callback(
    Output('tabs-content', 'children'),
    Input('tabs', 'active_tab')
)
def update_tab(selected_tab):
    if selected_tab == 'current-run':
        return dbc.Card([
            dbc.CardHeader(html.H4("Latest Test Summary", className="fw-bold text-primary")),
            dbc.CardBody([
                dbc.Row([
                    dbc.Col(dbc.Card([
                        dbc.CardBody([
                            html.P(f"Test Name: {latest_test_summary['TestName'].values[0] if not latest_test_summary.empty else 'N/A'}", className='fw-bold'),
                            html.P(f"Start Time: {latest_test_summary['StartTime'].values[0] if not latest_test_summary.empty else 'N/A'}"),
                            html.P(f"End Time: {latest_test_summary['EndTime'].values[0] if 'EndTime' in latest_test_summary.columns and not latest_test_summary.empty else 'N/A'}"),
                            html.P(f"Total Duration: {latest_test_summary['TotalDuration'].values[0] if not latest_test_summary.empty else 0:.2f} seconds"),
                            html.P(f"Total Steps: {latest_test_summary['TotalSteps'].values[0] if not latest_test_summary.empty else 0}"),
                            html.P(f"Passed Steps: {latest_test_summary['SuccessfulSteps'].values[0] if not latest_test_summary.empty else 0}"),
                            html.P(f"Failed Steps: {latest_test_summary['FailedSteps'].values[0] if not latest_test_summary.empty else 0}"),
                        ])
                    ], className="shadow-sm bg-light rounded p-3 border border-primary"), width=4),
                    dbc.Col(dcc.Graph(figure=pie_chart(latest_test_summary.to_dict(orient="records")[0])), width=8)
                ]),
                html.Br(),
                dbc.Row([
                    dbc.Col(dcc.Graph(figure=step_execution_chart(latest_test_steps)), width=12)
                ]),
                html.Br(),
                dbc.Row([
    dbc.Col(html.H5("Test Step Details", className="fw-bold text-primary"), width=12),
    dbc.Col(dash_table.DataTable(
        id='latest-step-details-table',
        columns=[
            {"name": col, "id": col} for col in latest_test_steps.columns 
            if col not in ['ScreenshotPath', 'ConsoleErrors']
        ] + [
            {"name": "Console Errors", "id": "ConsoleErrors"},
            {"name": "Screenshot", "id": "ScreenshotPath", "presentation": "markdown"}  # 🔹 Markdown for clickable links
        ],
        data=[
            {
                **row, 
                "ScreenshotPath": f"[View Screenshot]({row['ScreenshotPath']})" if row.get("ScreenshotPath") else "No Screenshot"
            }
            for row in latest_test_steps.to_dict('records')
        ] if not latest_test_steps.empty else [],
        style_table={'overflowX': 'auto'},
        style_cell={'textAlign': 'left'},
        style_header={'backgroundColor': '#0056b3', 'color': 'white', 'fontWeight': 'bold'},
        filter_action="native",
        sort_action="native",
        page_action="native",
        page_size=10,
        markdown_options={"link_target": "ScreenshotPath"}  # 🔹 Open links in a new tab
    ), width=12)
])
            ])
        ], className="shadow-sm p-3 bg-white rounded border border-primary")

    elif selected_tab == 'historical-data':
        return dbc.Card([
            dbc.CardHeader(html.H4("Historical Test Data", className="fw-bold text-primary")),
            dbc.CardBody([
                dcc.Graph(figure=historical_test_trend(historical_summary)),
                dcc.Graph(figure=failure_bar_chart(historical_summary)),
                dcc.Graph(figure=error_frequency_heatmap(historical_steps)),
                html.Br(),
                html.H5("Step Execution Summary", className="fw-bold text-primary"),
                dash_table.DataTable(
                    id='historical-step-summary',
                    columns=[{"name": col, "id": col} for col in historical_step_counts.columns],
                    data=historical_step_counts.to_dict('records'),
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left'},
                    style_header={'backgroundColor': '#0056b3', 'color': 'white', 'fontWeight': 'bold'},
                    filter_action="native", sort_action="native", page_action="native", page_size=10
                )
            ])
        ], className="shadow-sm p-3 bg-white rounded border border-primary")

    
    elif selected_tab == 'chatgpt-analysis':
        return dbc.Card([
            dbc.CardHeader(html.H4("ChatGPT Analysis", className="fw-bold text-primary")),
            dbc.CardBody([
                html.Pre(chatgpt_analysis, className="p-3 bg-light border rounded")
            ])
        ], className="shadow-sm p-3 bg-white rounded border border-primary")

    return None
if __name__ == "__main__":
    app.run_server(debug=True)
