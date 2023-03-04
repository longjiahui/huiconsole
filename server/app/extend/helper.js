// this.ctx => context 对象
module.exports = {
    buildTree(arr, {
        key = '_id',
        childrenKey = 'children',
        parentKey = 'parent',
    } = {}) {
        let dict = arr.reduce((t, i)=>{
            t[i[key]] = i
            return t
        }, {})
        let tree = []
        arr.forEach(i=>{
            i[childrenKey] = i[childrenKey].map(child=>{
                return dict[child] || dict[ii?.[key]]
            })
            if(!dict[i[parentKey]] && !dict[i[parentKey]?.[key]]){
                tree.push(i)
            }
        })
        return tree
    },
}