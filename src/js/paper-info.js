export default class PaperInfo {
  constructor(tabUrl) {
    const url = new URL(tabUrl);

    const paperTestString = url.pathname.slice(
      url.pathname.lastIndexOf("/") + 1,
      url.pathname.lastIndexOf(".")
    );

    const regexCie = /^\d{4}[_-][smw]\d{2}[_-].*[_-]\d{2}$/i;

    if (regexCie.test(paperTestString)) {
      const [code, [session, ...year], _, version] =
        paperTestString.split(/[-_]/);

      const examSessions = {
        m: "February",
        s: "May",
        w: "October",
      };

      this.code = code;
      this.session = examSessions[session];
      this.year = parseInt("20" + year.join(""));
      this.version = version;
      this.url = url.href;
    }
  }

  get searchQuery() {
    return this.code
      ? `${this.code} ${this.session} ${this.year} paper ${this.version}`
      : "";
  }
}
