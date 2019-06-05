import WpSource from "..";
import state from "./state";
import actions from "./actions";
import { Api, Resolver, populate, routeUtils } from "./libraries";

const wpSource = (): WpSource => ({
  name: "@frontity/wp-source",
  state: {
    source: state
  },
  actions: {
    source: actions
  },
  libraries: {
    source: {
      api: new Api(),
      resolver: new Resolver(),
      populate,
      ...routeUtils
    }
  }
});

export default wpSource;
