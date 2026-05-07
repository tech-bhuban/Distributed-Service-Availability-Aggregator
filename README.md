# 📡 Distributed Health Aggregator

A high-performance Node.js utility designed to monitor the availability and latency of multiple distributed endpoints in parallel. 

## 🛠 Advanced Features
- **Concurrent Execution**: Leverages `Promise.allSettled` to execute network requests in parallel without failing the entire batch on a single error.
- **Latency Measurement**: Implements manual timing logic to calculate round-trip response times for performance auditing.
- **Resilient Networking**: Configures a strict 5000ms timeout on all `axios` requests to prevent the event loop from stalling on unresponsive servers.
- **Environment Aware**: Configured to use `process.env.PORT` for seamless deployment to cloud providers.

## 🚀 Setup & Usage
1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   npm install express axios
   ```
2. **Run**:
   ```bash
   node server.js
   ```
3. **API Access**: 
   Visit `http://localhost:3000/api/health` to receive a structured JSON report of all monitored services.

## ⚙️ Technical Logic
The application treats every external request as a discrete task. By wrapping each request in its own `try/catch` and aggregating them through an asynchronous map, the system maintains high "fail-soft" reliability—meaning the monitor itself never crashes even if the services it monitors are down.

## License
MIT
