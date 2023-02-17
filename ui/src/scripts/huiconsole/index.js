import utils from '@/scripts/utils'
import MessageTransporter from './messageTransporter'

let huiconsole = new MessageTransporter({
    to: window.top, 
})
huiconsole.command('getToken').then(token=>{
    utils.setLocal('token', token)
})

huiconsole.openTab = (name, data)=>huiconsole.command('openTab', {name, data, isTransparent: true})
huiconsole.closeTab = ()=>huiconsole.command('closeTab')

export default huiconsole