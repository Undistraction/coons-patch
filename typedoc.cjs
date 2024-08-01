/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['./src/index.ts'],
  out: 'docs',
  categorizeByGroup: true,
  groupOrder: ['API', '*'],
  sort: 'source-order',
}
