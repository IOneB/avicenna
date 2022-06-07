class Restriction {
  constructor(body = {}) {
    this.id = body.id;
    this.name = body.name;
    this.type = body.type;
  }
}

module.exports = Restriction;
