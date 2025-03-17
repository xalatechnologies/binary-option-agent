

// ---- File: styles.css ----

/* Light theme (default) */
:root {
    --primary: #2563eb;
    --primary-dark: #1e40af;
    --primary-light: #3b82f6;
    --secondary: #14b8a6;
    --background: #f1f5f9;
    --card-bg: #ffffff;
    --text: #1e293b;
    --text-light: #64748b;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --border: #cbd5e1;
    --header-height: 60px;
    --footer-height: 110px;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --radius: 8px;
    --modal-overlay: rgba(0, 0, 0, 0.5);
}

/* Dark theme */
[data-theme="dark"] {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --primary-light: #60a5fa;
    --secondary: #14b8a6;
    --background: #1e293b;
    --card-bg: #0f172a;
    --text: #e2e8f0;
    --text-light: #94a3b8;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --border: #334155;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    --modal-overlay: rgba(0, 0, 0, 0.7);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    min-height: 100%;
    /* Remove overflow: hidden to allow scrolling */
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background);
    color: var(--text);
    /* Keep flex display but allow content to flow naturally */
    display: flex;
    flex-direction: column;
}

header {
    background-color: var(--card-bg);
    box-shadow: var(--shadow);
    height: var(--header-height);
    flex-shrink: 0;
    z-index: 100;
    display: flex;
    align-items: center;
}

.header-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

.logo i {
    font-size: 1.75rem;
    color: var(--primary);
}

.logo h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: flex-end;
    flex-shrink: 0;
}

#docs-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
}

.status-indicators {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    flex: 1;
}

.status-indicator {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
}

.status-indicator.connected {
    color: var(--success);
}

.status-indicator.disconnected {
    color: var(--danger);
}

.status-indicator.downloading {
    color: var(--warning);
}

.status-indicator.ready {
    color: var(--success);
}

.status-indicator.error {
    color: var(--danger);
}

.status-indicator.initializing {
    color: var(--text-light);
}

main {
    padding: 1rem 1rem;
    flex-grow: 1;
    /* Remove fixed height calculation to allow content to expand naturally */
    min-height: 400px; /* Set a minimum height for the main content */
}

.dashboard-container {
    max-width: 1280px;
    margin: 0 auto;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.dashboard-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
}

.controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
}

.trade-mode-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    background-color: var(--card-bg);
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.trade-amount-controls {
    display: flex;
    align-items: center;
    gap: 5px;
}

.trading-select {
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 14px;
    color: var(--text);
}

.trade-input {
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 5px 8px;
    width: 70px;
    font-size: 14px;
    color: var(--text);
}

.btn {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: var(--primary-dark);
}

.symbols-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

/* Account Summary Styles */
.account-summary-container {
    background-color: var(--card-bg);
    border-radius: var(--radius);
    padding: 1.25rem;
    box-shadow: var(--shadow);
    margin-bottom: 1.5rem;
}

.account-summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.account-summary-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
}

.account-type-badge {
    background-color: var(--primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.account-type-badge.paper {
    background-color: var(--primary);
}

.account-type-badge.live {
    background-color: var(--danger);
}

.account-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.account-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
}

.warning-message {
    background-color: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
}

.warning-message i {
    color: var(--danger);
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.warning-message ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.warning-message li {
    margin-bottom: 0.5rem;
    color: var(--text);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.account-metric {
    flex: 1;
    min-width: 150px;
    background-color: var(--background);
    border-radius: var(--radius);
    padding: 0.75rem 1rem;
}

/* Color coding for positive and negative values in account metrics */
.account-metric .metric-value.positive {
    color: var(--success);
}

.account-metric .metric-value.negative {
    color: var(--danger);
}

.positions-summary {
    background-color: var(--background);
    border-radius: var(--radius);
    padding: 0.75rem;
}

.positions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.positions-table-container {
    overflow-x: auto;
}

.positions-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}

.positions-table th,
.positions-table td {
    padding: 0.5rem 0.75rem;
    text-align: right;
}

.positions-table th:first-child,
.positions-table td:first-child {
    text-align: left;
}

.positions-table th {
    font-weight: 500;
    color: var(--text-light);
}

.positions-table tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .positions-table tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.03);
}

.positions-table .positive {
    color: var(--success);
}

.positions-table .negative {
    color: var(--danger);
}

.no-positions {
    text-align: center !important;
    color: var(--text-light);
    padding: 1rem !important;
}

/* Position Info in Symbol Cards */
.position-info {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 0 0 var(--radius) var(--radius);
    display: block !important; /* Force display */
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .position-info {
    background-color: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Remove the header styles since we're not using it anymore */

.position-metrics-vertical {
    display: flex;
    flex-direction: column;
    gap: 0.25rem; /* Reduce gap between rows */
}

.position-metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.position-metric-row .metric-title {
    font-size: 0.75rem; /* Slightly smaller font */
    color: var(--text-light);
}

.position-metric-row .metric-value {
    font-size: 0.85rem; /* Slightly smaller font */
    font-weight: 500;
}

.position-metric-row .metric-value.positive {
    color: var(--success);
}

.position-metric-row .metric-value.negative {
    color: var(--danger);
}

/* Symbol Card Styles */
.symbol-card {
    background-color: var(--card-bg);
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    max-height: 450px;
    display: flex;
    flex-direction: column;
}

.symbol-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.symbol-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.symbol-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
}

.last-updated {
    font-size: 0.7rem;
    color: var(--text-light);
}

.metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.875rem;
    margin-bottom: 1.25rem;
}

.metric {
    text-align: center;
}

.metric-title {
    font-size: 0.7rem;
    color: var(--text-light);
    margin-bottom: 0.4rem;
}

.metric-value {
    font-size: 1.125rem;
    font-weight: 600;
}

.metric-value.decision {
    padding: 0.2rem 0.45rem;
    border-radius: var(--radius);
    font-size: 0.9rem;
}

.decision.buy {
    background-color: #dcfce7;
    color: #166534;
}

.decision.sell {
    background-color: #fee2e2;
    color: #991b1b;
}

.decision.hold {
    background-color: #fef9c3;
    color: #854d0e;
}

.price-chart-container {
    height: 130px;
    margin: 0.75rem 0;
    padding: 0.25rem;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    flex-shrink: 0;
}

.price-chart {
    width: 100%;
    height: 100%;
    min-height: 120px; /* Ensure canvas has minimum height */
    display: block;
}

.trade-info {
    padding-top: 0.6rem;
    border-top: 1px solid var(--border);
    margin-top: auto;
}

.trade-details {
    font-size: 0.875rem;
    color: var(--text-light);
    padding: 0.5rem;
    border-radius: var(--radius);
}

.trade-executed {
    background-color: #dcfce7;
    color: #166534;
}

/* Special case for SELL transactions to match decision indicator colors */
.trade-executed.sell-transaction {
    background-color: #fee2e2;
    color: #991b1b;
}

.trade-failed {
    background-color: #fee2e2;
    color: #991b1b;
}

.trade-skipped {
    background-color: #fef9c3;
    color: #854d0e;
}

/* Test buttons - removed as requested */

.history-section {
    background-color: var(--card-bg);
    border-radius: var(--radius);
    padding: 1.25rem;
    box-shadow: var(--shadow);
    margin-bottom: 1.25rem;
}

.history-section h3 {
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
}

.activity-log {
    max-height: 300px; /* Increased height for more visible entries */
    overflow-y: auto;
    font-size: 0.8rem;
    /* Add padding for scrollbar to ensure content doesn't touch scrollbar */
    padding-right: 4px;
}

.activity-item {
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    /* Add padding to ensure spacing when scrollbar appears */
    padding-right: 8px;
    flex-wrap: nowrap;
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-item.buy i {
    color: var(--success);
    flex-shrink: 0;
}

.activity-item.sell i {
    color: var(--danger);
    flex-shrink: 0;
}

.activity-item.hold i {
    color: var(--warning);
    flex-shrink: 0;
}

.activity-details {
    /* Allow details to shrink if needed */
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.activity-timestamp {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-left: auto;
    flex-shrink: 0; /* Prevent timestamp from shrinking */
    min-width: 120px; /* Ensure space for timestamp */
    text-align: right;
}

.empty-log {
    color: var(--text-light);
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
}

.help-tip {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: rgba(59, 130, 246, 0.1);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 0.9rem;
    border-left: 3px solid var(--primary);
}

.trading-status-tip {
    margin: 0 0 1.5rem 0;
    background-color: rgba(59, 130, 246, 0.15);
    border-left: 3px solid var(--primary);
    font-weight: 500;
    border-radius: var(--radius);
    padding: 0.9rem 1rem;
    box-shadow: var(--shadow);
    transition: background-color 0.5s, border-left-color 0.5s;
}

/* Trading enabled/disabled status classes */
.trading-enabled {
    background-color: rgba(16, 185, 129, 0.15);
    border-left-color: #10b981;
}

.trading-enabled strong {
    color: #10b981;
}

.trading-disabled {
    background-color: rgba(239, 68, 68, 0.15);
    border-left-color: #ef4444;
}

.trading-disabled strong {
    color: #ef4444;
}

/* Dark mode adjustments */
[data-theme="dark"] .trading-enabled strong {
    color: #34d399;
}

[data-theme="dark"] .trading-disabled strong {
    color: #f87171;
}

footer {
    background-color: var(--card-bg);
    /* Keep height but remove positioning constraints */
    min-height: var(--footer-height);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
    width: 100%;
    z-index: 10;
    margin-top: 20px; /* Add space between content and footer */
    padding: 20px 0;
}

.footer-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
    font-size: 0.8rem;
    color: var(--text-light);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 100%;
}

.footer-links {
    display: flex;
    gap: 1.25rem;
    justify-content: center;
    margin: 6px 0 8px 0;
}

.footer-link, .license-link {
    color: var(--primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.2s;
    font-weight: 500;
    font-size: 0.75rem;
}

.footer-link:hover, .license-link:hover {
    color: var(--primary-dark);
}

.license-link {
    display: inline;
}

.footer-link i {
    font-size: 0.9rem;
}

.system-info {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.badge {
    display: inline-block;
    padding: 0.15rem 0.4rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 500;
}

.badge-blue {
    background-color: #dbeafe;
    color: #1e40af;
}

.badge-red {
    background-color: #fee2e2;
    color: #991b1b;
}

.badge-yellow {
    background-color: #fef9c3;
    color: #854d0e;
}

.badge-gray {
    background-color: #f3f4f6;
    color: #4b5563;
}

.badge-purple {
    background-color: #e9d5ff;
    color: #6b21a8;
}

.badge-green {
    background-color: #dcfce7;
    color: #166534;
}

.trading-toggle-container {
    margin-right: 1rem;
}

.btn-large {
    padding: 0.75rem 1.25rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.btn-success {
    background-color: #4CAF50;
    color: white;
}

.btn-danger {
    background-color: var(--danger);
    color: white;
}

.btn-warning {
    background-color: var(--warning);
    color: white;
}

/* Animation for toasts */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
}

.simulation-banner {
    background-color: #8b5cf6;
    color: white;
    text-align: center;
    padding: 8px 0;
    font-weight: bold;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 1.1rem;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    animation: pulse-attention 2s infinite;
}

@keyframes pulse-attention {
    0% { background-color: #8b5cf6; }
    50% { background-color: #7c3aed; }
    100% { background-color: #8b5cf6; }
}

@media (max-width: 768px) {
    .metrics {
        grid-template-columns: 1fr 1fr;
    }
    
    .metric:last-child {
        grid-column: span 2;
    }
}

/* Documentation modal */
.modal {
    display: none; /* Hidden by default */
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--modal-overlay);
    overflow: auto;
}

/* When modal is shown */
.modal.show {
    display: flex;
    align-items: flex-start;
    justify-content: center;
}

/* Theme Selector Styles */
.theme-selector {
    position: relative;
    display: inline-block;
}

.theme-button {
    background-color: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.35rem 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.theme-button:hover {
    background-color: rgba(203, 213, 225, 0.1);
}

.theme-options {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.5rem;
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    z-index: 10;
    min-width: 120px;
}

.theme-options.show {
    display: block;
}

.theme-option {
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: var(--text);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
}

.theme-option:hover {
    background-color: rgba(203, 213, 225, 0.1);
}

/* Ensure the Dark theme option is visible in both light and dark modes */
.theme-option[data-theme="dark"] {
    color: #1e293b;
}

/* Make dark theme option text visible in dark mode */
[data-theme="dark"] .theme-option[data-theme="dark"] {
    color: #ffffff;
}

.theme-option.active {
    background-color: rgba(59, 130, 246, 0.1);
    color: var(--primary);
    font-weight: 500;
}

.modal-content {
    background-color: var(--card-bg);
    margin: 40px auto;
    padding: 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    height: fit-content; /* Adjust height to fit content */
}

/* Liquidation modal specific styles */
#liquidation-modal .modal-content {
    max-width: 400px;
    padding: 12px;
    margin: 15% auto; /* Center vertically at 15% from top instead of fixed 40px */
    position: relative;
    height: auto; /* Allow height to adjust to content */
    display: flex;
    flex-direction: column;
    min-height: 0; /* Prevent extra space */
}

#liquidation-modal .modal-body {
    padding-bottom: 0; /* Remove padding at the bottom */
}

#liquidation-modal .modal-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
}

#liquidation-modal .modal-header h2 {
    font-size: 1.25rem;
}

#liquidation-modal .warning-message {
    background-color: rgba(220, 38, 38, 0.1);
    border-left: 3px solid var(--danger);
    padding: 0.75rem;
    border-radius: var(--radius);
    margin-bottom: 0.75rem;
}

#liquidation-modal .warning-row {
    display: flex;
    align-items: flex-start;
}

#liquidation-modal .warning-icon {
    flex-shrink: 0;
    margin-right: 0.5rem;
    padding-top: 2px;
}

#liquidation-modal .warning-content {
    flex-grow: 1;
}

#liquidation-modal .warning-title {
    margin-bottom: 0.5rem;
    line-height: 1.2;
}

#liquidation-modal .warning-message i {
    color: var(--danger);
    font-size: 1.1rem;
}



#liquidation-modal .warning-message ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

#liquidation-modal .warning-message li {
    margin-bottom: 0.25rem;
}

#liquidation-modal .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0; /* Ensure no extra space at bottom */
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

.modal-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
}

.close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-light);
}

.close-modal:hover {
    color: var(--text);
}

.modal-body h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem;
    color: var(--primary);
}

.modal-body h3:first-child {
    margin-top: 0;
}

.modal-body p {
    margin-bottom: 1rem;
    line-height: 1.6;
}

.modal-body ul, .modal-body ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.modal-body li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

.modal-body code {
    background-color: rgba(203, 213, 225, 0.2);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.9em;
    color: var(--text);
    border: 1px solid var(--border);
}

.modal-body .note {
    background-color: rgba(245, 158, 11, 0.1);
    border-left: 3px solid var(--warning);
    padding: 0.75rem;
    border-radius: var(--radius);
    margin: 1rem 0;
    font-size: 0.9em;
}

.service-accounts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.service-account {
    background-color: rgba(59, 130, 246, 0.05);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.service-account:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.service-account h4 {
    margin-top: 0;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    color: var(--primary);
}

.service-account p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.account-link {
    display: inline-block;
    background-color: var(--primary);
    color: white;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background-color 0.2s;
}

.account-link:hover {
    background-color: var(--primary-dark);
}

.modal-body .code-command {
    background-color: var(--card-bg);
    color: var(--primary);
    border: 1px solid var(--border);
    padding: 0.3rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-weight: 500;
    font-size: 0.9em;
}

.modal-body table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
}

.modal-body th, .modal-body td {
    border: 1px solid var(--border);
    padding: 0.75rem;
    text-align: left;
}

.modal-body th {
    background-color: rgba(203, 213, 225, 0.1);
    font-weight: 600;
}

.modal-body .btn {
    display: inline-block;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        justify-content: center;
    }
    
    header {
        height: auto;
        min-height: var(--header-height);
        padding: 8px 0;
    }
    
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .symbols-container {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        width: 95%;
        margin: 20px auto;
        padding: 16px;
    }
}

/* News feed styling */
.news-feed {
    background-color: var(--card-bg);
    border-radius: var(--radius);
    padding: 15px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}

.news-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    animation: fadeIn 0.3s ease-in-out;
}

.news-item:last-child {
    border-bottom: none;
}

.news-item i {
    color: var(--primary);
    font-size: 16px;
    margin-right: 10px;
    margin-top: 3px;
}

.news-details {
    flex-grow: 1;
    line-height: 1.4;
}

.news-headline {
    font-weight: 600;
    display: block;
    margin-bottom: 5px;
    color: var(--text);
    text-decoration: none;
}

a.news-headline:hover {
    color: var(--primary);
    text-decoration: underline;
}

.news-meta {
    font-size: 0.85em;
    color: var(--text-light);
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.news-symbols {
    font-weight: 500;
}

.news-source {
    font-style: italic;
}

.news-time {
    margin-left: auto;
}

/* Custom styles for the strategy modal */
.strategy-modal-content {
    max-width: 700px;
}

/* Strategies section styles */
.strategies-container {
    margin-top: 1rem;
    background-color: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
}

.strategies-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
}

.strategies-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.strategies-status i {
    font-size: 1rem;
}

.strategies-actions {
    display: flex;
    gap: 0.5rem;
}

.strategies-list {
    padding: 1rem;
}

.strategy-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: var(--radius);
    background-color: var(--background);
    margin-bottom: 0.75rem;
    transition: all 0.2s ease;
}

.strategy-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
}

.strategy-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
}

.strategy-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text);
}

.strategy-description {
    font-size: 0.9rem;
    color: var(--text-light);
}

.strategy-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.strategy-status {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    text-align: center;
    background-color: var(--border);
    color: var(--text);
    min-width: 80px;
}

.strategy-status.enabled {
    background-color: var(--success);
    color: white;
}

.strategy-status.disabled {
    background-color: var(--danger);
    color: white;
}

.strategy-toggle {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
}

.strategy-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.strategy-toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border);
    transition: .4s;
    border-radius: 34px;
}

.strategy-toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

.strategy-toggle input:checked + .strategy-toggle-slider {
    background-color: var(--success);
}

.strategy-toggle input:checked + .strategy-toggle-slider:before {
    transform: translateX(24px);
}

.empty-strategies {
    text-align: center;
    padding: 2rem 0;
    color: var(--text-light);
    font-style: italic;
}

.strategy-signals {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
}

.strategy-signals-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.signal-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.signal-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-radius: var(--radius);
    background-color: var(--background);
    transition: all 0.2s ease;
}

.signal-item:hover {
    transform: translateX(2px);
    box-shadow: var(--shadow);
}

.signal-symbol {
    font-weight: 600;
}

.signal-decision {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.signal-decision.buy {
    background-color: var(--success);
    color: white;
}

.signal-decision.sell {
    background-color: var(--danger);
    color: white;
}

.signal-decision.hold {
    background-color: var(--warning);
    color: white;
}

.signal-time {
    font-size: 0.875rem;
    color: var(--text-light);
}

.signal-strategy {
    font-size: 0.875rem;
    color: var(--text-light);
    font-style: italic;
}

/* Toast notifications */
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: var(--radius);
    background-color: var(--card-bg);
    color: var(--text);
    box-shadow: var(--shadow);
    z-index: 1000;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
    max-width: 300px;
}

.toast.show {
    opacity: 1;
    transform: translateY(0);
}

.toast-success {
    border-left: 4px solid var(--success);
}

.toast-error {
    border-left: 4px solid var(--danger);
}

.toast-warning {
    border-left: 4px solid var(--warning);
}

.toast-info {
    border-left: 4px solid var(--primary);
}

/* Strategy toggle loading state */
.strategy-toggle {
    position: relative;
}

.strategy-toggle.loading .strategy-toggle-slider {
    opacity: 0.5;
}

.strategy-loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--primary);
    display: none;
    font-size: 14px;
}

.strategy-toggle.loading .strategy-loading-indicator {
    display: block;
}

/* Badge styling for Redis communication indicators */
.badge {
    display: inline-block;
    padding: 0.25em 0.6em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}

.badge-info {
    color: #fff;
    background-color: #17a2b8;
}

.badge-warning {
    color: #212529;
    background-color: #ffc107;
}

.badge-success {
    color: #fff;
    background-color: #28a745;
}

/* Tooltip styling for strategy manager status */
[data-toggle="tooltip"] {
    position: relative;
    cursor: help;
    border-bottom: 1px dotted var(--text-light);
}

[data-toggle="tooltip"]::after {
    content: attr(title);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 200px;
    padding: 8px 12px;
    border-radius: var(--radius);
    background-color: var(--text);
    color: white;
    font-size: 12px;
    text-align: center;
    white-space: normal;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
}

[data-toggle="tooltip"]:hover::after {
    opacity: 1;
    visibility: visible;
}

/* Strategy restart button */
#restart-strategies-btn {
    margin-left: 8px;
    display: none;
}

/* Status indicator for strategy manager states */
.status-indicator.stalled {
    color: #f5a700;
}

.status-indicator.restarting {
    color: #3498db;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
}

.btn-small {
    padding: 2px 6px;
    font-size: 12px;
    line-height: 1.5;
}

// ---- File: index.html ----

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TraderMagic Dashboard</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
    <style>
        /* Styles for invalid Alpaca symbols */
        .alpaca-invalid-symbol {
            border: 2px solid #ff3b30 !important;
            position: relative;
        }
        
        .disabled-chart {
            opacity: 0.5;
            pointer-events: none;
        }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    {% if debug_mode %}
    <div class="simulation-banner">
        <i class="fas fa-exclamation-triangle"></i> DEBUG MODE - All trades are simulated locally with NO API CALLS (even in paper trading mode)
    </div>
    {% endif %}
    
    <header {% if debug_mode %}style="margin-top: 30px;"{% endif %}>
        <div class="header-container">
            <div class="logo">
                <i class="fas fa-hat-wizard"></i>
                <h1>TraderMagic</h1>
            </div>
            <div class="status-indicators">
                <div class="status-indicator">
                    <span id="connection-status">
                        <i class="fas fa-circle-notch fa-spin"></i> Connecting...
                    </span>
                </div>
                <div class="status-indicator" id="ollama-status-container" style="display: none;">
                    <span id="ollama-status">
                        <i class="fas fa-brain"></i> <span id="ollama-status-text">Loading...</span>
                    </span>
                </div>
            </div>
            <div class="header-actions">
                <div class="theme-selector">
                    <button id="theme-toggle" class="theme-button">
                        <i class="fas fa-sun" id="theme-icon"></i>
                        <span id="theme-text">Auto</span>
                    </button>
                    <div class="theme-options" id="theme-options">
                        <div class="theme-option" data-theme="auto">
                            <i class="fas fa-adjust"></i> Auto
                        </div>
                        <div class="theme-option" data-theme="light">
                            <i class="fas fa-sun"></i> Light
                        </div>
                        <div class="theme-option" data-theme="dark">
                            <i class="fas fa-moon"></i> Dark
                        </div>
                    </div>
                </div>
                <button id="docs-btn" class="btn">
                    <i class="fas fa-question-circle"></i> Help
                </button>
            </div>
        </div>
    </header>

    <main>
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h2>Trading Dashboard</h2>
                <div class="controls">
                    <div class="trading-toggle-container">
                        <button id="trading-toggle-btn" class="btn btn-large {% if trading_enabled %}btn-danger{% else %}btn-success{% endif %}">
                            <i class="fas {% if trading_enabled %}fa-stop-circle{% else %}fa-play-circle{% endif %}"></i> 
                            {% if trading_enabled %}Stop Trading{% else %}Start Trading{% endif %}
                        </button>
                    </div>
                    
                    <div class="trade-mode-controls">
                        <label for="trade-mode-select">Trade Mode:</label>
                        <select id="trade-mode-select" class="trading-select">
                            <option value="percentage" {% if not fixed_amount_mode %}selected{% endif %}>Portfolio Percentage</option>
                            <option value="fixed" {% if fixed_amount_mode %}selected{% endif %}>Fixed Amount</option>
                        </select>
                        
                        <div id="percentage-controls" class="trade-amount-controls" {% if fixed_amount_mode %}style="display:none"{% endif %}>
                            <label for="trade-percentage">Percentage:</label>
                            <input type="number" id="trade-percentage" min="0.1" max="100" step="0.1" value="{{ trade_percentage }}" class="trade-input">
                            <span>%</span>
                        </div>
                        
                        <div id="fixed-amount-controls" class="trade-amount-controls" {% if not fixed_amount_mode %}style="display:none"{% endif %}>
                            <label for="fixed-amount">Amount:</label>
                            <span>$</span>
                            <input type="number" id="fixed-amount" min="1" step="0.01" value="{{ fixed_amount }}" class="trade-input">
                        </div>
                        
                        <button id="save-trade-settings" class="btn">
                            <i class="fas fa-save"></i> Save
                        </button>
                    </div>
                    
                    <button id="refresh-btn" class="btn">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                    
                    <!-- Add new API refresh button -->
                    <button id="refresh-api-btn" class="btn btn-info" style="background-color: #3b82f6; color: white; margin-left: 5px;">
                        <i class="fas fa-key"></i> Refresh API
                    </button>
                </div>
            </div>
            
            <div class="account-summary-container" id="account-summary-container">
                <div class="account-summary-header">
                    <h3>Account Summary</h3>
                    <span class="account-type-badge" id="account-type-badge">Loading...</span>
                </div>
                <div class="account-metrics">
                    <div class="account-metric">
                        <div class="metric-title">Portfolio Value</div>
                        <div class="metric-value" id="portfolio-value">$0.00</div>
                    </div>
                    <div class="account-metric">
                        <div class="metric-title">Cash Balance</div>
                        <div class="metric-value" id="cash-balance">$0.00</div>
                    </div>
                    <div class="account-metric">
                        <div class="metric-title">Buying Power</div>
                        <div class="metric-value" id="buying-power">$0.00</div>
                    </div>
                    <div class="account-metric">
                        <div class="metric-title">Daily Change</div>
                        <div class="metric-value" id="daily-change">$0.00</div>
                    </div>
                </div>
                <div class="account-actions">
                    <button id="liquidate-all-btn" class="btn btn-danger">
                        <i class="fas fa-exclamation-triangle"></i> Liquidate All Positions
                    </button>
                </div>
            </div>
            
            <div class="symbols-container">
                {% for symbol in symbols %}
                <div class="symbol-card" id="card-{{ symbol|replace('/', '-') }}">
                    <div class="symbol-header">
                        <h3>{{ symbol }}</h3>
                        <span class="last-updated" id="updated-{{ symbol|replace('/', '-') }}">Waiting for data...</span>
                        <button 
                            class="refresh-card-btn" 
                            style="font-size: 0.7rem; padding: 2px 5px; margin-left: 5px; display: none;"
                            onclick="refreshCard('{{ symbol }}')">🔄</button>
                        <button 
                            class="debug-info-btn" 
                            style="font-size: 0.7rem; padding: 2px 5px; margin-left: 5px; display: none; background-color: #eab308; color: white;"
                            onclick="showDebugInfo('{{ symbol }}')">📊</button>
                    </div>
                    <div class="metrics">
                        <div class="metric">
                            <div class="metric-title">RSI Value</div>
                            <div class="metric-value" id="rsi-{{ symbol|replace('/', '-') }}">--</div>
                        </div>
                        <div class="metric">
                            <div class="metric-title">Decision</div>
                            <div class="metric-value decision" id="decision-{{ symbol|replace('/', '-') }}">--</div>
                        </div>
                        <div class="metric">
                            <div class="metric-title">Status</div>
                            <div class="metric-value" id="status-{{ symbol|replace('/', '-') }}">--</div>
                        </div>
                    </div>

                    <div class="price-chart-container">
                        <!-- Enforce unique ID and fixed dimensions for canvas -->
                        <canvas 
                            id="price-chart-{{ symbol|replace('/', '-') }}" 
                            class="price-chart"
                            width="300"
                            height="120"
                        ></canvas>
                    </div>
                    <div class="trade-info" id="trade-info-{{ symbol|replace('/', '-') }}">
                        <div class="trade-details">No recent trades</div>
                    </div>
                    <div class="position-info" id="position-info-{{ symbol|replace('/', '-') }}">
                        <div class="position-metrics-vertical">
                            <div class="position-metric-row">
                                <div class="metric-title">Quantity:</div>
                                <div class="metric-value" id="position-qty-{{ symbol|replace('/', '-') }}">0</div>
                            </div>
                            <div class="position-metric-row">
                                <div class="metric-title">Value:</div>
                                <div class="metric-value" id="position-value-{{ symbol|replace('/', '-') }}">$0.00</div>
                            </div>
                            <div class="position-metric-row">
                                <div class="metric-title">P/L:</div>
                                <div class="metric-value" id="position-pl-{{ symbol|replace('/', '-') }}">$0.00</div>
                            </div>
                        </div>
                    </div>
                </div>
                {% endfor %}
            </div>
            
            <div class="history-section">
                <h3>Recent Activity</h3>
                <div class="activity-log" id="activity-log">
                    <div class="empty-log">No recent activity</div>
                </div>
            </div>
            
            <div class="history-section">
                <h3>Recent News</h3>
                <div class="news-feed" id="news-feed">
                    <div class="empty-log">No recent news</div>
                </div>
            </div>
            
            <div class="history-section">
                <h3>Trading Strategies</h3>
                <div class="strategies-container" id="strategies-container">
                    <div class="strategies-header">
                        <div class="strategies-status">
                            <span id="strategies-status-text">Loading strategies...</span>
                        </div>
                        <div class="strategies-actions">
                            <button id="start-strategies-btn" class="btn btn-success">
                                <i class="fas fa-play"></i> Start Strategy Manager
                            </button>
                            <button id="stop-strategies-btn" class="btn btn-danger" style="display: none;">
                                <i class="fas fa-stop"></i> Stop Strategy Manager
                            </button>
                            <button id="restart-strategies-btn" class="btn btn-warning" style="display: none;">
                                <i class="fas fa-sync"></i> Restart Strategy Manager
                            </button>
                        </div>
                    </div>
                    <div class="strategies-list" id="strategies-list">
                        <div class="empty-strategies">No strategies available</div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Liquidation Confirmation Modal -->
    <div id="liquidation-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Confirm Liquidation</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-message">
                    <div class="warning-row">
                        <div class="warning-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="warning-content">
                            <div class="warning-title"><strong>Warning:</strong> This action will:</div>
                            <ul>
                                <li>Immediately sell all open positions</li>
                                <li>Stop all active trading processes</li>
                                <li>This action cannot be undone</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p>Are you sure you want to proceed?</p>
                <div class="modal-actions">
                    <button id="cancel-liquidation" class="btn">Cancel</button>
                    <button id="confirm-liquidation" class="btn btn-danger">Yes, Liquidate All</button>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <div class="footer-container">
            <p>&copy; 2025 TraderMagic by Tim Green - Local AI Trading System. Inspired by the work of Mike Russell and the Creator Magic Community.</p>
            <div class="footer-links">
                <a href="https://github.com/rawveg/trader-magic" target="_blank" class="footer-link">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="https://www.linkedin.com/in/rawveg" target="_blank" class="footer-link">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="https://opensource.org/licenses/MIT" target="_blank" class="footer-link">
                    <i class="fas fa-balance-scale"></i> MIT License
                </a>
                <a href="http://www.creatormagic.ai" target="_blank" class="footer-link">
                    <i class="fas fa-star"></i> Creator Magic
                </a>
            </div>
            <div class="system-info">
                {% if debug_mode %}
                <span class="badge badge-purple">Debug Mode (No API Calls)</span>
                {% endif %}
                
                {% if paper_trading %}
                <span class="badge badge-blue">Paper Trading</span>
                {% else %}
                <span class="badge badge-red">Live Trading</span>
                {% endif %}
                
                {% if trading_enabled %}
                <span class="badge badge-green">Trading Enabled</span>
                {% else %}
                <span class="badge badge-gray">Trading Disabled</span>
                {% endif %}
                
                {% if enforce_pdt and not paper_trading %}
                <span class="badge badge-yellow">PDT Rules Enforced (stocks only)</span>
                {% else %}
                <span class="badge badge-gray">PDT Rules Disabled</span>
                {% endif %}
            </div>
        </div>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Global flag to ensure Chart.js is loaded before initialization
        window.chartJsLoaded = false;
        window.addEventListener('load', function() {
            window.chartJsLoaded = true;
            console.log("Chart.js confirmed loaded");
        });
    </script>
    
    <!-- Documentation Modal -->
    <div id="help-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>TraderMagic Documentation</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <h3>Overview</h3>
                <p>TraderMagic is an AI-powered automated trading system that uses RSI technical indicators to make trading decisions. The system consists of four main components:</p>
                <ul>
                    <li><strong>Data Retrieval Service:</strong> Fetches RSI data from TAAPI.io</li>
                    <li><strong>AI Decision Engine:</strong> Uses Ollama LLM to analyze RSI data and decide whether to buy, sell, or hold</li>
                    <li><strong>Trade Execution Service:</strong> Connects to Alpaca for executing trades based on AI decisions</li>
                    <li><strong>Web Dashboard:</strong> This interface for monitoring trading activity in real-time</li>
                </ul>
                
                <h3>Required Accounts</h3>
                <p>To use TraderMagic, you'll need accounts with these services:</p>
                <div class="service-accounts">
                    <div class="service-account">
                        <h4><a href="https://taapi.io" target="_blank" rel="noopener">TAAPI.io <i class="fas fa-external-link-alt"></i></a></h4>
                        <p>Provides technical analysis data (RSI values). Their free tier allows limited usage, but paid tiers offer more frequent updates and additional symbols.</p>
                        <a href="https://taapi.io/signup" target="_blank" rel="noopener" class="account-link">Sign up for TAAPI</a>
                    </div>
                    <div class="service-account">
                        <h4><a href="https://alpaca.markets" target="_blank" rel="noopener">Alpaca <i class="fas fa-external-link-alt"></i></a></h4>
                        <p>Executes trades based on system signals. Offers paper trading (simulated) for testing without using real money.</p>
                        <a href="https://app.alpaca.markets/signup" target="_blank" rel="noopener" class="account-link">Sign up for Alpaca</a>
                    </div>
                </div>
                <p class="note"><strong>Note:</strong> After creating accounts, you'll need to add your API keys to the <code>.env</code> file to connect the system to these services.</p>

                <h3>Dashboard Updates</h3>
                <p>This dashboard updates in two ways:</p>
                <ul>
                    <li><strong>Automatic updates:</strong> The dashboard refreshes every 15 seconds</li>
                    <li><strong>Manual refresh:</strong> Use the "Refresh" button for immediate updates</li>
                </ul>
                <p>Both update methods only retrieve data from Redis cache, not directly from external APIs. This ensures no additional load on rate-limited services.</p>

                <h3>Account Summary</h3>
                <p>The account summary section provides key financial metrics:</p>
                <ul>
                    <li><strong>Portfolio Value:</strong> Total value of your account</li>
                    <li><strong>Cash Balance:</strong> Available cash in your account</li>
                    <li><strong>Buying Power:</strong> Available funds for trading</li>
                    <li><strong>Daily Change:</strong> Today's portfolio change, color-coded green for positive and red for negative changes</li>
                </ul>

                <h3>Theme Options</h3>
                <p>The dashboard supports three theme options, accessible via the theme selector in the top-right corner:</p>
                <ul>
                    <li><strong>Auto:</strong> Automatically matches your system's theme preference</li>
                    <li><strong>Light:</strong> Classic light theme for daytime use</li>
                    <li><strong>Dark:</strong> Reduced eye strain for nighttime use</li>
                </ul>

                <h3>TAAPI.io Rate Limits</h3>
                <p>The system is designed to respect TAAPI.io's rate limits based on your subscription tier:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Rate Limit</th>
                            <th>Recommended Poll Interval</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Free</td>
                            <td>1 request / 15 seconds</td>
                            <td>300 seconds (5 minutes)</td>
                        </tr>
                        <tr>
                            <td>Basic</td>
                            <td>5 requests / 15 seconds</td>
                            <td>60 seconds (1 minute)</td>
                        </tr>
                        <tr>
                            <td>Pro</td>
                            <td>30 requests / 15 seconds</td>
                            <td>10 seconds</td>
                        </tr>
                        <tr>
                            <td>Expert</td>
                            <td>75 requests / 15 seconds</td>
                            <td>5 seconds</td>
                        </tr>
                    </tbody>
                </table>
                <p>During initial startup, you may see 429 rate limit errors in the logs - this is expected while the services initialize and space out their requests.</p>

                <h3>Trading Information</h3>
                <p>The system trades a small percentage of your portfolio (default: 2%) and includes safeguards:</p>
                <ul>
                    <li>Balance checking ensures trades are only executed when sufficient funds are available</li>
                    <li>Minimum order size enforcement prevents very small trades</li>
                    <li>Paper trading mode is enabled for safe testing (indicated by the blue "Paper Trading" badge)</li>
                </ul>
                
                <h3>Symbol Formats</h3>
                <p>The system supports two types of symbols:</p>
                <ul>
                    <li><strong>Cryptocurrencies:</strong> Use format like "BTC/USDT", "ETH/USDT", etc.</li>
                    <li><strong>Stocks:</strong> Use simple ticker symbols like "AAPL", "TSLA", etc. - these will automatically be converted to the right format</li>
                </ul>
                <p class="note"><strong>Note:</strong> Free TAAPI accounts are limited to specific symbols only. If you're using the free tier, you may need to upgrade for full symbol support.</p>

                <h3>Debug Mode</h3>
                <p>When running in debug mode (indicated by a yellow banner at the top), you can:</p>
                <ul>
                    <li><strong>Test Trading:</strong> Execute simulated trades directly from the dashboard</li>
                    <li><strong>Safe Testing:</strong> All trades are simulated locally with no API calls</li>
                    <li><strong>Instant Feedback:</strong> Get immediate responses about trade decisions</li>
                </ul>
                <p>Debug mode is perfect for testing trading strategies and UI functionality without affecting your account.</p>

                <h3>Troubleshooting</h3>
                <p>If you encounter issues:</p>
                <ol>
                    <li>Check Docker logs: <code class="code-command">docker compose logs -f</code></li>
                    <li>Ensure your API keys are correctly configured in the .env file</li>
                    <li>Verify that all services are running: <code class="code-command">docker compose ps</code></li>
                    <li>Restart the system using the restart script: <code class="code-command">./restart.sh</code></li>
                </ol>
                <p>For more detailed information, refer to the README.md file in the project repository.</p>
            </div>
        </div>
    </div>

    <script src="{{ url_for('static', filename='js/dashboard.js') }}"></script>
    <script src="{{ url_for('static', filename='js/strategies.js') }}"></script>
    <script>
    // Debug utilities for card and account refresh
    function showDebugInfo(symbol) {
        console.log(`Showing debug info for ${symbol}`);
        
        // Check Redis data directly for this symbol
        fetch(`/api/redis/trade_result:${symbol}`)
            .then(response => response.json())
            .then(data => {
                console.log(`Redis data for ${symbol}:`, data);
                alert(`Redis data for ${symbol}:\n${JSON.stringify(data.value, null, 2)}`);
                
                // Force a card refresh
                refreshCard(symbol);
                
                // Force an account update
                fetch('/api/force_account_update')
                    .then(response => response.json())
                    .then(data => {
                        console.log('Force account update result:', data);
                        if (data.success) {
                            alert(`Account data update triggered successfully.\nCheck the browser console for details.`);
                        } else {
                            alert(`Error updating account data: ${data.error}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error forcing account update:', error);
                        alert(`Error forcing account update: ${error.message}`);
                    });
            })
            .catch(error => {
                console.error(`Error fetching Redis data for ${symbol}:`, error);
                alert(`Error fetching Redis data: ${error.message}`);
            });
    }

    // Make the debug buttons visible when Ctrl+Shift+D is pressed
    document.addEventListener('keydown', function(event) {
        // Ctrl+Shift+D to toggle debug mode (consistent with existing refresh buttons)
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            const debugBtns = document.querySelectorAll('.debug-info-btn');
            debugBtns.forEach(btn => {
                btn.style.display = btn.style.display === 'none' ? 'inline-block' : 'none';
            });
            console.log('Debug info buttons toggled');
        }
    });
    </script>
</body>
</html>

// ---- File: dashboard.md ----

# 📊 Dashboard Features

The TraderMagic dashboard provides a real-time view of your trading activities with an intuitive, responsive interface.

![Dashboard Screenshot](./img/dashboard-screenshot.jpg)

## 📈 Key Features

- **Current RSI values** for each symbol
- **Latest AI trading decisions** (Buy, Sell, Hold)
- **Trade execution status** with detailed results
- **Recent activity history** log
- **Trading toggle** button to control when trades are executed
- **Market status visualization** showing regular, pre-market, after-hours, and closed market sessions
- **Price charts** with session-specific markers
- **Automatic updates** every 15 seconds
- **Manual refresh** button for on-demand updates

## 🔄 Real-Time Data

Both automatic and manual refreshes retrieve data from Redis cache, not directly from external APIs, ensuring no additional load on rate-limited services.

## 💰 Account Summary

The account summary section provides key financial metrics:

- **Portfolio Value**: Total value of your account
- **Cash Balance**: Available cash in your account
- **Buying Power**: Available funds for trading
- **Daily Change**: Today's portfolio change (color-coded):
  - Green: Positive change (+)
  - Red: Negative change (-)
  - Shows both dollar amount and percentage

## 🌙 Theme Options

The dashboard supports light and dark modes:

- **Auto**: Follows your system preference
- **Light**: Classic light theme for daytime use
- **Dark**: Reduced eye strain for nighttime use

The theme selector ensures all options remain clearly visible regardless of the current theme.

## 🔧 Trade Settings Control

Easily modify trading parameters directly from the dashboard:

1. **Trade Mode Selection**:
   - Portfolio Percentage: Trade a percentage of your account
   - Fixed Amount: Trade a specific dollar amount

2. **Amount Configuration**:
   - Adjust percentage (0.1% to 100%)
   - Set fixed dollar amount ($1 minimum)

3. **Trading Control**:
   - Start/Stop button to enable or disable trading
   - Prevents accidental trades until you're ready

## 📱 Responsive Design

The dashboard is designed to work on all devices:
- Desktop: Full-featured trading dashboard
- Tablet: Optimized layout for medium screens
- Mobile: Compact view for monitoring on the go

## 📊 Price Charts with Market Context

Price charts provide valuable context about market conditions:

### 🕒 Market Session Indicators

Different marker styles show when a price candle was recorded:
- **Regular Market Hours**: Small circular points
- **Pre-Market**: Triangle markers
- **After-Hours**: Rotated square markers
- **Closed Market**: X markers

### 📈 Session-Aware Visualization

This visual distinction helps you:
- Identify price movements during different market sessions
- Recognize patterns unique to pre-market or after-hours trading
- Distinguish between high-volume regular hours and thinner extended hours
- Factor market conditions into trading decisions

### 🔄 Automatic Timezone Adjustment

The system automatically determines the appropriate market session based on Eastern Time (ET), the standard for US stock markets. This provides context about potential liquidity and volatility during different trading sessions.

## 🧪 Debug Interface

For testing purposes, a special debug page is available at `http://localhost:9753/debug`:

- Direct trade execution buttons
- Current configuration display
- Test trade functionality

This debug interface is invaluable for verifying that your trade settings are working correctly without waiting for trade signals.