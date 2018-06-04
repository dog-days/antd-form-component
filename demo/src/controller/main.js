//外部依赖包
import Controller from 'react-router-controller';

//内部依赖包
import LayoutComponent from 'src/view/layout/main';
const title = 'Antd form components';

export default class MainController extends Controller {
  LayoutComponent = LayoutComponent;
  indexView(params) {
    return this.render(
      {
        title,
      },
      params
    );
  }
}
