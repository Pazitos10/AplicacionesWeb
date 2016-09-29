'use strict';

describe('Empresas E2E Tests:', function () {
  describe('Test Empresas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/empresas');
      expect(element.all(by.repeater('empresa in empresas')).count()).toEqual(0);
    });
  });
});
