from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "precios-overrides.json"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/api/precios":
            self.send_json(self._read_data())
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/precios":
            payload = self._read_json_body()
            self._write_data(payload)
            self.send_json(payload)
            return
        super().do_POST()

    def do_DELETE(self):
        if self.path == "/api/precios":
            self._write_data({})
            self.send_json({})
            return
        super().do_DELETE()

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        body = self.rfile.read(length).decode("utf-8")
        try:
            return json.loads(body) if body else {}
        except json.JSONDecodeError:
            return {}

    def _read_data(self):
        if DATA_FILE.exists():
            try:
                return json.loads(DATA_FILE.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                return {}
        return {}

    def _write_data(self, payload):
        if not isinstance(payload, dict):
            payload = {}
        DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    def send_json(self, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Servidor escuchando en http://0.0.0.0:{port}")
    server.serve_forever()
