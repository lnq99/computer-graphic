import Vue from 'vue';

import {
  Col, Row, Card, Form, FormItem,
  Button, Select, Option, RadioButton, RadioGroup,
  InputNumber, Slider, ColorPicker, Popover,
} from 'element-ui';

import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

import App from './App.vue';
import router from './router';
import store from './store';

locale.use(lang);
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

Vue.use(Col);
Vue.use(Row);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(InputNumber);
Vue.use(Slider);
Vue.use(ColorPicker);
Vue.use(Popover);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
