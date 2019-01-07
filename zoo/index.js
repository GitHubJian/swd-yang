import './css/reset.css'
import './css/components.scss'

import components from './components/index.js'
import Mp3 from './utils/recorder/mp3.js'

const install = (Vue, opts = {}) => {
  console.log(components)
  components.forEach(component => {
    Vue.component(component.name, component)

    Vue.prototype.$mp3 = Mp3
  })
}

export default {
  install
}
