const { app, assert, mock } = require('egg-mock/bootstrap')
const user = require('./user')
// mock.consoleLevel('NONE')

describe('admin', function(){
    this.timeout(0)

    let token
    before(async function(){
        token = await user.getToken()
    })
    

    it('admin-save', async function(){
        let title = `title-${Math.random()}`
        let res = await app.httpRequest().post('/api/admin/save')
            .send({
                $model: 'Post',
                title,
                content: `content-${Math.random()}`,
                category: `category-${Math.random()}`,
                description: `description-${Math.random()}`,
            })
            .set('authorization', token)
            .expect(200)
            .expect(res=>assert(res && res.body && res.body._id))

        let _id = res.body._id
        await app.httpRequest().post('/api/admin/get')
            .send({
                _id,
                $model: 'Post',
            })
            .set('authorization', token)
            .expect(200)
            .expect(res=>assert(res && res.body && res.body.data && res.body.data.title === title))
        await app.httpRequest().post('/api/admin/delete')
            .send({
                _id,
                $model: 'Post',
            })
            .set('authorization', token)
            .expect(200)
            .expect(res=>assert(res.body.code === 0))
    })

    it('admin-login', async function(){
        await app.httpRequest().post('/api/admin/login')
            .send({
                password: app.config.adminPassword
            })
            .expect(200)
            .expect(res=>assert(res.body.data))
    })
})