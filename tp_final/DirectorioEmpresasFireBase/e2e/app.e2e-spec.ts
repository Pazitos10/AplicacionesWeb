import { DirectorioEmpresasFireBasePage } from './app.po';

describe('directorio-empresas-fire-base App', function() {
  let page: DirectorioEmpresasFireBasePage;

  beforeEach(() => {
    page = new DirectorioEmpresasFireBasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
