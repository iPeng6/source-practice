module.exports = {
  get url() {
    return this.req.url
  },
  get header() {
    return this.req.headers
  },
}
