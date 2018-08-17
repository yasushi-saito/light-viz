import { mapGetters, mapActions } from 'vuex';
import { Getters, Actions } from 'pvw-lightviz/src/stores/types';

export default {
  name: 'ActionModules',
  props: {
    smallScreen: {
      default: false,
    },
  },
  computed: mapGetters({
    modules: Getters.MODULES_LIST,
    activeSources: Getters.PROXY_SELECTED_IDS,
  }),
  methods: mapActions({
    activate: Actions.MODULES_ACTIVE_BY_NAME,
  }),
};
