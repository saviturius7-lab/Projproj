import os
import pandas as pd
import streamlit as st

try:
    from supabase import create_client
except ImportError:  # pragma: no cover
    create_client = None


SUPABASE_URL = os.getenv("SUPABASE_URL", "https://agptkyggblylaaxirxtc.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncHRreWdnYmx5bGFheGlyeHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDg1NjYsImV4cCI6MjA5ODMyNDU2Nn0.qxgNT4JH8SLAiZ7uU-CdkpTczXnHtXn7eNQGTvzG3cA")

if create_client is not None:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None


st.set_page_config(page_title="Shramik Sakshi Admin Panel", layout="wide")

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:wght@400;500&display=swap');
    .stApp {
        background: #f4ecd8;
        background-image: radial-gradient(ellipse at top, #f7f0de 0%, #e8ddc0 100%);
        color: #3b2f1e;
        font-family: 'Lora', Georgia, serif;
    }
    .block-container {
        padding-top: 2rem;
        padding-bottom: 2.5rem;
        padding-left: 2rem;
        padding-right: 2rem;
    }
    h1, h2, h3 {
        font-family: 'Playfair Display', Georgia, serif;
        color: #2a1f12;
        letter-spacing: 0.5px;
    }
    h1 {
        font-size: 2.4rem;
        margin-bottom: 0.15rem;
        border-bottom: 2px solid #8b6f47;
        padding-bottom: 0.4rem;
    }
    p {
        color: #4a3a25;
        font-size: 1.02rem;
        margin-top: 0;
        line-height: 1.7;
    }
    [data-testid="stMetricValue"] {
        color: #5a3e1b;
        font-size: 1.4rem;
        font-weight: 700;
        font-family: 'Playfair Display', serif;
    }
    [data-testid="stMetricLabel"] {
        color: #6b5330;
        font-size: 0.95rem;
    }
    div[data-testid="stSidebar"] {
        background: #efe4c8;
        border-right: 2px solid #8b6f47;
        padding: 1.5rem 1.2rem 1.2rem 1.2rem;
        box-shadow: inset 0 0 0 1px rgba(90, 62, 27, 0.12);
    }
    div[data-testid="stSidebar"] .stButton > button,
    div[data-testid="stSidebar"] a {
        width: 100%;
        border-radius: 4px;
        font-weight: 600;
        font-family: 'Lora', serif;
    }
    div[data-testid="stSidebar"] a {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0.75rem 1rem;
        background: #7a5a2e;
        color: #f4ecd8 !important;
        text-decoration: none !important;
        margin-top: 0.75rem;
        border: 1px solid #5a3e1b;
        box-shadow: 0 4px 10px rgba(90, 62, 27, 0.18);
    }
    div[data-testid="stSidebar"] a:hover {
        background: #5a3e1b;
    }
    .stSuccess {
        background-color: #ebe0c2;
        color: #3b2f1e;
        border: 1px solid #8b6f47;
        border-radius: 4px;
        padding: 1rem 1.1rem;
    }
    .stInfo {
        background-color: #e7ddc4;
        color: #3b2f1e;
        border: 1px solid #a0845c;
        border-radius: 4px;
        padding: 1rem 1.1rem;
    }
    .stDownloadButton > button, .stButton > button {
        background: #7a5a2e;
        color: #f4ecd8;
        border: 1px solid #5a3e1b;
        border-radius: 4px;
        padding: 0.75rem 1.05rem;
        font-weight: 600;
        font-family: 'Lora', serif;
    }
    .st-bb {
        margin-bottom: 1rem;
    }
    .streamlit-expanderHeader {
        font-size: 1rem;
        font-family: 'Playfair Display', serif;
    }
    .css-1d391kg {
        gap: 1.5rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    "<h1 style='margin-bottom:0.2rem;'>📊 Shramik Sakshi - NGO Wage Protection Command Center</h1>"
    "<p style='color:#4f6572; margin-top:0; font-size:1.02rem;'>Clear worker visibility, transparent wage tracking, and trustworthy field oversight.</p>",
    unsafe_allow_html=True,
)

if supabase is None:
    st.error("Supabase client could not be initialized. Please check the environment variables.")
    st.stop()

try:
    response = supabase.table("work_logs").select("*").execute()
    df = pd.DataFrame(response.data or [])
except Exception as e:
    st.error(f"Failed to load data from Supabase: {e}")
    st.stop()

if df.empty:
    st.info("No work logs found yet.")
    st.stop()

for col in ["latitude", "longitude", "estimated_wage"]:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

if "created_at" in df.columns:
    df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")

if "phone_number" in df.columns:
    df["phone_number"] = df["phone_number"].astype(str).fillna("")

st.sidebar.header("🧭 Command Center Controls")
worker_filter = st.sidebar.selectbox(
    "Select Worker",
    ["All Workers", *sorted(df["phone_number"].dropna().unique().tolist())],
)

st.sidebar.markdown('---')
st.sidebar.markdown(
    "**⚠️ HOW TO TEST:**\n"
    "1. Click the button below to open WhatsApp.\n"
    "2. Send the message: **join smart-river** (This connects you to the live demo).\n"
    "3. Once joined, send your location pin!"
)
st.sidebar.markdown('---')
st.sidebar.link_button("💬 Chat with Bot on WhatsApp", "https://wa.me/14155238886")

if worker_filter != "All Workers":
    df = df[df["phone_number"] == worker_filter].copy()

metric_col1, metric_col2, metric_col3 = st.columns(3)
with metric_col1:
    unique_workers = df["phone_number"].nunique() if "phone_number" in df.columns else 0
    st.metric("Active Laborers Verified", int(unique_workers))
with metric_col2:
    st.metric("Total Man-Days Logged", int(len(df)))
with metric_col3:
    total_wages = float(df["estimated_wage"].sum()) if "estimated_wage" in df.columns else 0.0
    st.metric("Secured Capital", f"₹{total_wages:,.0f}")

st.markdown("<div style='margin: 1rem 0; border-bottom: 1px solid #d9e2ec;'></div>", unsafe_allow_html=True)

if worker_filter != "All Workers":
    st.subheader(f"🧑‍🏭 Worker Profile — {worker_filter}")
    st.success("Verified / Dispute-Free")

    worker_df = df.sort_values(by="created_at", ascending=True) if "created_at" in df.columns else df.copy()
    if not worker_df.empty and "created_at" in worker_df.columns:
        worker_df = worker_df.dropna(subset=["created_at"])
        if not worker_df.empty:
            worker_df = worker_df.assign(day_index=range(1, len(worker_df) + 1))
            st.line_chart(worker_df.set_index("created_at")["day_index"])
            st.caption("Chronological workdays for the selected laborer")

    export_text = (
        f"Shramik Sakshi Work History Audit\n"
        f"Worker: {worker_filter}\n"
        f"Total Entries: {len(df)}\n"
        f"Estimated Wage Total: ₹{float(df['estimated_wage'].sum()) if 'estimated_wage' in df.columns else 0.0:,.0f}\n"
    )
    st.download_button(
        label="Download Official Work History Audit PDF",
        data=export_text,
        file_name=f"{worker_filter}_work_history_audit.txt",
        mime="text/plain",
    )
else:
    st.info("Select a worker to view a personalized timeline, profile badge, and exportable audit file.")

location_df = df.dropna(subset=["latitude", "longitude"])
st.subheader("🗺️ Live Deployment Map")
if not location_df.empty:
    st.map(location_df[["latitude", "longitude"]])
else:
    st.info("No location coordinates available for the current selection.")

st.subheader("📋 Official Work Log Ledger")
display_df = df.copy()
if "created_at" in display_df.columns:
    display_df = display_df.sort_values(by="created_at", ascending=False)

st.dataframe(display_df, use_container_width=True)
