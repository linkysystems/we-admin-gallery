import Ember from 'ember';

export default Ember.Component.extend({
  submit: 'submit',
  cancel: 'cancel',

  content: null,

  actions: {
    submit(content) {
      this.sendAction('submit', content);
    },
    cancel(content) {
      this.sendAction('cancel', content);
    }
  }
});