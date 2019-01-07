import './css/reset.css'
import './css/components.scss'

import components from './components/index.js'

const install = (Vue, opts = {}) => {
  console.log(components)
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}
