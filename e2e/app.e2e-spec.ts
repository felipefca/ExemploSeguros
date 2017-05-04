import { Exemplo.SegurosPage } from './app.po';

describe('exemplo.seguros App', () => {
  let page: Exemplo.SegurosPage;

  beforeEach(() => {
    page = new Exemplo.SegurosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
