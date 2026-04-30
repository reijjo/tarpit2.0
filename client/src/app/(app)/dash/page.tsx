function DashContent() {
  return (
    <div className="dash-container">
      <h1>Welcome to your dashboard!</h1>
      <p>This is where you can manage your account and view your data.</p>
    </div>
  );
}

export default function Dashboard() {
  return <DashContent />;
}
