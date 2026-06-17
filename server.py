import os
import http.server
import urllib.parse

DIR = os.path.dirname(os.path.abspath(__file__))
PORT = 5500

REDIRECTS = {
    "/acne-scar.html": "/acne-scar-ambattur",
    "/lip-pigmentation.html": "/lip-pigmentation-ambattur",
    "/facial-hydra-glow.html": "/facial-hydra-glow-ambattur",
    "/lash-enhancements.html": "/lash-enhancements-ambattur",
    "/aesthetic-add-ons.html": "/aesthetic-add-ons-ambattur",
    "/stretch-mark-revision.html": "/stretch-mark-revision-ambattur",
    "/mesotherapy.html": "/mesotherapy-ambattur",
    "/laser-hair-removal.html": "/laser-hair-removal-ambattur",
    "/eyebrow-enhancement.html": "/eyebrow-enhancement-ambattur",
    "/treatment/exfoliation-extraction.html": "/treatment/exfoliation-extraction-ambattur",
    "/micro-pigmentation.html": "/micro-pigmentation-ambattur",
    "/hifu-rf-mnrf.html": "/hifu-rf-mnrf-ambattur",
    "/pico-carbon-laser.html": "/pico-carbon-laser-ambattur",
    "/body-contouring.html": "/body-contouring-ambattur",
    "/anti-aging.html": "/anti-aging-ambattur",
    "/laser-tattoo-removal.html": "/laser-tattoo-removal-ambattur",
    "/co2-laser.html": "/co2-laser-ambattur",
    "/hair-transplant.html": "/hair-transplant-ambattur",
    "/eczema.html": "/eczema-ambattur",
    "/rf-microneedling.html": "/rf-microneedling-ambattur",
    "/scar-revision.html": "/scar-revision-ambattur",
    "/skin-tightening.html": "/skin-tightening-ambattur",
    "/psoriasis.html": "/psoriasis-ambattur",
    "/wart-removal.html": "/wart-removal-ambattur",
    "/tan-removal.html": "/tan-removal-ambattur",
    "/pigmentation-melasma.html": "/pigmentation-melasma-ambattur",
    "/vitiligo.html": "/vitiligo-ambattur",
    "/prp-face.html": "/prp-face-ambattur",
}

class Handler(http.server.SimpleHTTPRequestHandler):
    def _handle(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"

        if path in REDIRECTS:
            self.send_response(301)
            self.send_header("Location", REDIRECTS[path])
            self.end_headers()
            return True

        if path != "/" and not os.path.splitext(path)[1]:
            html_path = os.path.join(DIR, path.lstrip("/") + ".html")
            if os.path.exists(html_path):
                self.path = path + ".html"

        return False

    def do_GET(self):
        if self._handle():
            return
        super().do_GET()

    def do_HEAD(self):
        if self._handle():
            return
        super().do_HEAD()

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {args[0]} {args[1]} {args[2]}")

if __name__ == "__main__":
    os.chdir(DIR)
    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Serving at http://127.0.0.1:{PORT}")
    print(f"Stop with Ctrl+C")
    server.serve_forever()
