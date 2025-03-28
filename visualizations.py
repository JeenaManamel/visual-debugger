import plotly.graph_objects as go
import pandas as pd

def pie_chart(summary):
    """Generate a sleek pie chart for test step success vs failure rate."""
    return {
        'data': [go.Pie(
            labels=['Passed', 'Failed'],
            values=[summary['SuccessfulSteps'], summary['FailedSteps']],
            hole=0.4,
            textinfo='label+percent',
            marker=dict(colors=['#28a745', '#dc3545']),
            hoverinfo='label+percent+value',
        )],
        'layout': go.Layout(
            title='Step Status Distribution',
            font=dict(size=14),
            showlegend=True
        )
    }



def historical_test_trend(historical_data):
    """Generate an interactive historical test execution trend with improved readability."""

    if historical_data.empty:
        return go.Figure(layout={"title": "No Historical Data Available"})

    fig = go.Figure()

    # **Failed Steps Series**
    fig.add_trace(go.Scatter(
        x=historical_data['StartTime'],
        y=historical_data['FailedSteps'],
        mode='lines+markers',
        name='Failed Steps',
        marker=dict(color='red', size=8),
        line=dict(width=2, color='red'),
        customdata=historical_data[['StartTime', 'FailedSteps', 'SuccessfulSteps']],  # Extra data for hover
        hovertemplate=(
            "<b>Test Run Date:</b> %{customdata[0]}<br>"
            "<b>Failed Steps:</b> %{customdata[1]}<br>"
            
            "<extra></extra>"  # Removes default hover box
        ),
    ))

    # **Successful Steps Series**
    fig.add_trace(go.Scatter(
        x=historical_data['StartTime'],
        y=historical_data['SuccessfulSteps'],
        mode='lines+markers',
        name='Successful Steps',
        marker=dict(color='green', size=8),
        line=dict(width=2, color='green'),
        customdata=historical_data[['StartTime', 'FailedSteps', 'SuccessfulSteps']],  # Extra data for hover
        hovertemplate=(
            "<b>Test Run Date:</b> %{customdata[0]}<br>"
            
            "<b>Successful Steps:</b> %{customdata[2]}<br>"
            "<extra></extra>"
        ),
    ))

    # **Layout Enhancements**
    fig.update_layout(
        title=dict(
            text="Historical Test Execution Trends",
            font=dict(size=18, family="Arial, sans-serif"),
            x=0.5  # Center align title
        ),
        xaxis=dict(
            title="Test Run Date",
            tickangle=0,  #  Keep dates straight
            showgrid=True,
            gridcolor="lightgray",
            tickfont=dict(size=12, family="Arial"),
            showline=True,
            linewidth=2,
            linecolor="black"
        ),
        yaxis=dict(
            title="Number of Steps",
            showgrid=True,
            gridcolor="lightgray",
            zeroline=True,
            zerolinecolor="black",
            tickfont=dict(size=12, family="Arial"),
            showline=True,
            linewidth=2,
            linecolor="black"
        ),
        font=dict(size=12, family="Arial"),
        plot_bgcolor="white",  #  Set background to plain white
        hovermode="x unified",
        margin=dict(l=60, r=40, t=60, b=100),  # Adjust margin for readability
    )

    return fig


def failure_bar_chart(historical_data):
    """Generate a bar chart displaying failure counts over multiple test runs."""
    return {
        'data': [go.Bar(
            x=historical_data['StartTime'],
            y=historical_data['FailedSteps'],
            name='Failures',
            marker=dict(color='red'),
            hoverinfo='x+y'
        )],
        'layout': go.Layout(
            title='Test Failures Over Time',
            xaxis=dict(title='Test Execution Date', showgrid=False),
            yaxis=dict(title='Number of Failed Steps', showgrid=True),
            font=dict(size=14)
        )
    }

def error_frequency_heatmap(historical_steps):
    """Generate a heatmap showing the frequency of errors in test steps."""
    if historical_steps.empty:
        return go.Figure().update_layout(
            title='Error Frequency Heatmap',
            xaxis=dict(title='Step Name'),
            yaxis=dict(title='Frequency')
        )

    # Group and count errors by StepName
    error_data = historical_steps[historical_steps['Status'] == 'Failed']
    error_counts = error_data.groupby('StepName')['ErrorMessage'].count().reset_index()
    error_counts.rename(columns={'ErrorMessage': 'Frequency'}, inplace=True)

    # Create heatmap
    fig = go.Figure(data=go.Heatmap(
        z=error_counts['Frequency'],
        x=error_counts['StepName'],
        y=['Frequency'] * len(error_counts),  # Single category for better visualization
        colorscale='Reds',
        hoverinfo='x+y+z'
    ))
    fig.update_layout(
        title='Error Frequency Heatmap',
        xaxis=dict(title='Step Name', tickangle=-45, showgrid=False),
        yaxis=dict(title='Frequency', showticklabels=False),
        font=dict(size=14)
    )
    return fig
def step_execution_chart(steps):
    """Generate a polished and professional step execution timeline."""
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=steps['StepName'],
        y=steps['Duration'],
        mode='lines+markers',
        marker=dict(color='#0056b3', size=10, line=dict(width=2, color='black')),
        line=dict(width=3, color='#0056b3'),
        name='Execution Time'
    ))
    fig.update_layout(
        title=dict(text='Step Execution Timeline', x=0.5, font=dict(size=22, color='#333', family='Arial, sans-serif')),
        xaxis=dict(
            title='Step Name',
            tickangle=-45,
            showgrid=False,
            showline=True,
            linewidth=2,
            linecolor='#333',
            tickfont=dict(size=14, family='Arial, sans-serif')
        ),
        yaxis=dict(
            title='Duration (s)',
            showgrid=True,
            gridcolor='lightgrey',
            dtick=0.5,
            zeroline=True,
            zerolinecolor='black',
            showline=True,
            linewidth=2,
            linecolor='#333',
            tickfont=dict(size=14, family='Arial, sans-serif')
        ),
        hovermode='x unified',
        font=dict(size=16, family='Arial, sans-serif'),
        plot_bgcolor='white',
        margin=dict(l=60, r=60, t=80, b=140),
        height=650,
    )
    return fig