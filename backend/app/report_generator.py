from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
import csv
from datetime import datetime
from typing import List, Dict


class ReportGenerator:
    """Generate PDF and CSV reports for portfolio and goals"""

    @staticmethod
    def generate_portfolio_pdf(user_data: Dict, investments: List[Dict], transactions: List[Dict]) -> BytesIO:
        """Generate comprehensive portfolio PDF report"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        elements.append(Paragraph("Portfolio Report", title_style))
        elements.append(Spacer(1, 0.2 * inch))

        # User Info
        user_info = f"""
        <b>Name:</b> {user_data.get('name', 'N/A')}<br/>
        <b>Email:</b> {user_data.get('email', 'N/A')}<br/>
        <b>Risk Profile:</b> {user_data.get('risk_profile', 'N/A').title()}<br/>
        <b>Report Generated:</b> {datetime.now().strftime('%B %d, %Y %I:%M %p')}<br/>
        """
        elements.append(Paragraph(user_info, styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))

        # Portfolio Summary
        total_investment = sum(inv.get('cost_basis', 0) for inv in investments)
        total_value = sum(inv.get('current_value', 0) for inv in investments)
        total_gain = total_value - total_investment
        gain_percent = (total_gain / total_investment * 100) if total_investment > 0 else 0

        summary_style = ParagraphStyle(
            'Summary',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#059669'),
            spaceAfter=12
        )
        elements.append(Paragraph("Portfolio Summary", summary_style))

        summary_data = [
            ['Metric', 'Value'],
            ['Total Invested', f'₹{total_investment:,.2f}'],
            ['Current Value', f'₹{total_value:,.2f}'],
            ['Total Gain/Loss', f'₹{total_gain:,.2f}'],
            ['Return %', f'{gain_percent:.2f}%']
        ]

        summary_table = Table(summary_data, colWidths=[3 * inch, 3 * inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 0.4 * inch))

        # Holdings
        if investments:
            elements.append(Paragraph("Holdings", summary_style))
            
            holdings_data = [['Symbol', 'Type', 'Units', 'Avg Price', 'Current Value']]
            for inv in investments:
                holdings_data.append([
                    inv.get('symbol', ''),
                    inv.get('asset_type', '').upper(),
                    f"{inv.get('units', 0):.2f}",
                    f"₹{inv.get('avg_buy_price', 0):,.2f}",
                    f"₹{inv.get('current_value', 0):,.2f}"
                ])

            holdings_table = Table(holdings_data)
            holdings_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(holdings_table)

        # Recent Transactions
        if transactions:
            elements.append(PageBreak())
            elements.append(Paragraph("Recent Transactions", summary_style))
            
            tx_data = [['Date', 'Symbol', 'Type', 'Quantity', 'Price']]
            for tx in transactions[:10]:  # Last 10 transactions
                executed_at = tx.get('executed_at', '')
                if isinstance(executed_at, str):
                    date_str = executed_at[:10]
                else:
                    date_str = executed_at.strftime('%Y-%m-%d') if executed_at else ''
                
                tx_data.append([
                    date_str,
                    tx.get('symbol', ''),
                    tx.get('type', '').upper(),
                    f"{tx.get('quantity', 0):.2f}",
                    f"₹{tx.get('price', 0):,.2f}"
                ])

            tx_table = Table(tx_data)
            tx_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(tx_table)

        doc.build(elements)
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_goals_pdf(user_data: Dict, goals: List[Dict]) -> BytesIO:
        """Generate goals progress PDF report"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        elements.append(Paragraph("Goals Progress Report", title_style))
        elements.append(Spacer(1, 0.2 * inch))

        # User Info
        user_info = f"""
        <b>Name:</b> {user_data.get('name', 'N/A')}<br/>
        <b>Report Generated:</b> {datetime.now().strftime('%B %d, %Y %I:%M %p')}<br/>
        """
        elements.append(Paragraph(user_info, styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))

        # Goals Summary
        total_target = sum(g.get('target_amount', 0) for g in goals)
        total_saved = sum(g.get('saved_amount', 0) for g in goals)
        overall_progress = (total_saved / total_target * 100) if total_target > 0 else 0

        summary_style = ParagraphStyle(
            'Summary',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#059669'),
            spaceAfter=12
        )
        elements.append(Paragraph("Overall Progress", summary_style))

        summary_data = [
            ['Metric', 'Value'],
            ['Total Goals', str(len(goals))],
            ['Total Target', f'₹{total_target:,.2f}'],
            ['Total Saved', f'₹{total_saved:,.2f}'],
            ['Overall Progress', f'{overall_progress:.1f}%']
        ]

        summary_table = Table(summary_data, colWidths=[3 * inch, 3 * inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 0.4 * inch))

        # Individual Goals
        if goals:
            elements.append(Paragraph("Goal Details", summary_style))
            
            for goal in goals:
                progress = (goal.get('saved_amount', 0) / goal.get('target_amount', 1)) * 100
                
                goal_info = f"""
                <b>{goal.get('title', 'Untitled Goal')}</b><br/>
                Type: {goal.get('goal_type', 'custom').title()}<br/>
                Target: ₹{goal.get('target_amount', 0):,.2f}<br/>
                Saved: ₹{goal.get('saved_amount', 0):,.2f}<br/>
                Progress: {progress:.1f}%<br/>
                Status: {goal.get('status', 'active').title()}
                """
                elements.append(Paragraph(goal_info, styles['Normal']))
                elements.append(Spacer(1, 0.2 * inch))

        doc.build(elements)
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_portfolio_csv(investments: List[Dict]) -> str:
        """Generate portfolio CSV data"""
        from io import StringIO
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['Symbol', 'Asset Type', 'Units', 'Avg Buy Price', 'Cost Basis', 'Current Value', 'Gain/Loss', 'Gain %'])
        
        # Data
        for inv in investments:
            cost_basis = inv.get('cost_basis', 0)
            current_value = inv.get('current_value', 0)
            gain_loss = current_value - cost_basis
            gain_percent = (gain_loss / cost_basis * 100) if cost_basis > 0 else 0
            
            writer.writerow([
                inv.get('symbol', ''),
                inv.get('asset_type', ''),
                inv.get('units', 0),
                inv.get('avg_buy_price', 0),
                cost_basis,
                current_value,
                gain_loss,
                f'{gain_percent:.2f}%'
            ])
        
        return output.getvalue()

    @staticmethod
    def generate_transactions_csv(transactions: List[Dict]) -> str:
        """Generate transactions CSV data"""
        from io import StringIO
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['Date', 'Symbol', 'Type', 'Quantity', 'Price', 'Fees', 'Total'])
        
        # Data
        for tx in transactions:
            executed_at = tx.get('executed_at', '')
            if isinstance(executed_at, str):
                date_str = executed_at[:10]
            else:
                date_str = executed_at.strftime('%Y-%m-%d') if executed_at else ''
            
            quantity = tx.get('quantity', 0)
            price = tx.get('price', 0)
            fees = tx.get('fees', 0)
            total = (quantity * price) + fees
            
            writer.writerow([
                date_str,
                tx.get('symbol', ''),
                tx.get('type', ''),
                quantity,
                price,
                fees,
                total
            ])
        
        return output.getvalue()
