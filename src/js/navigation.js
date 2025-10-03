// Sistema de Navegação Global
class NavigationManager {
  constructor() {
    this.currentUser = null;
    this.routes = {
      // Rotas para Vendedores
      'vendedor': {
        'Início': 'mission.html',
        'Metas': 'mission.html#metas',
        'Missões': 'mission.html',
        'Disputa': 'mission.html#disputa'
      },
      // Rotas para Gerentes
      'gerente': {
        'Painel Gerente': 'gerente-dashboard.html',
        'Ranking Regional': 'ranking-regional.html',
        'Disputas': 'gerente-disputa.html',
        'Gestão de Missões': 'gerente-missao.html',
        'Gestão de Vendas': 'gestao-vendas.html'
      }
    };
    
    this.init();
  }

  init() {
    this.currentUser = window.dataManager?.getCurrentUser();
    if (!this.currentUser) {
      this.redirectToLogin();
      return;
    }
    
    this.setupNavigation();
    this.setupBreadcrumbs();
    this.setupKeyboardNavigation();
    this.updateActivePage();
    this.showNavigationTips();
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
      // Adiciona atalho de teclado visual
      const shortcut = index + 1;
      link.setAttribute('data-shortcut', `Ctrl+${shortcut}`);
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkText = link.querySelector('span')?.textContent;
        this.navigateToPage(linkText);
      });
    });
  }

  navigateToPage(pageName) {
    if (!this.currentUser) {
      this.redirectToLogin();
      return;
    }

    const userRole = this.currentUser.role;
    const routes = this.routes[userRole];
    
    if (!routes || !routes[pageName]) {
      console.warn(`Rota não encontrada: ${pageName} para ${userRole}`);
      return;
    }

    const targetPage = routes[pageName];
    
    // Verifica se é uma âncora (contém #)
    if (targetPage.includes('#')) {
      const [page, anchor] = targetPage.split('#');
      if (page === window.location.pathname.split('/').pop()) {
        // Já está na página, apenas rola para a âncora
        this.scrollToAnchor(anchor);
        return;
      }
    }

    // Navega para a página
    window.location.href = targetPage;
  }

  scrollToAnchor(anchorId) {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumb-container');
    if (!breadcrumbContainer) return;

    const currentPage = this.getCurrentPageName();
    const breadcrumb = this.generateBreadcrumb(currentPage);
    
    breadcrumbContainer.innerHTML = breadcrumb;
  }

  getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    
    const pageNames = {
      'login.html': 'Login',
      'mission.html': 'Missões',
      'gerente-dashboard.html': 'Painel Gerente',
      'gerente-disputa.html': 'Disputas',
      'gerente-missao.html': 'Gestão de Missões',
      'gestao-vendas.html': 'Gestão de Vendas',
      'ranking-regional.html': 'Ranking Regional'
    };
    
    return pageNames[fileName] || 'Página';
  }

  generateBreadcrumb(currentPage) {
    const userRole = this.currentUser.role;
    const roleName = userRole === 'gerente' ? 'Gerente' : 'Vendedor';
    
    return `
      <nav class="breadcrumb">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <a href="${userRole === 'gerente' ? 'gerente-dashboard.html' : 'mission.html'}" class="breadcrumb-link">
              <i class="fas fa-home"></i> Início
            </a>
          </li>
          <li class="breadcrumb-separator">
            <i class="fas fa-chevron-right"></i>
          </li>
          <li class="breadcrumb-item active">
            <span class="breadcrumb-current">${currentPage}</span>
          </li>
        </ol>
      </nav>
    `;
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + número para navegação rápida
      if (e.ctrlKey || e.metaKey) {
        const userRole = this.currentUser?.role;
        if (!userRole) return;

        const routes = this.routes[userRole];
        const routeKeys = Object.keys(routes);
        
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.navigateToPage(routeKeys[0]);
            break;
          case '2':
            e.preventDefault();
            this.navigateToPage(routeKeys[1]);
            break;
          case '3':
            e.preventDefault();
            this.navigateToPage(routeKeys[2]);
            break;
          case '4':
            e.preventDefault();
            this.navigateToPage(routeKeys[3]);
            break;
          case '5':
            e.preventDefault();
            this.navigateToPage(routeKeys[4]);
            break;
        }
      }
      
      // ESC para voltar ao dashboard
      if (e.key === 'Escape') {
        const userRole = this.currentUser?.role;
        if (userRole === 'gerente') {
          window.location.href = 'gerente-dashboard.html';
        } else {
          window.location.href = 'mission.html';
        }
      }
    });
  }

  updateActivePage() {
    const currentPage = this.getCurrentPageName();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const linkText = link.querySelector('span')?.textContent;
      
      if (linkText === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  redirectToLogin() {
    if (window.location.pathname.includes('login.html')) return;
    window.location.href = 'login.html';
  }

  // Método para adicionar breadcrumbs a uma página
  addBreadcrumbsToPage() {
    const header = document.querySelector('.dashboard-header, .main-header');
    if (!header) return;

    const breadcrumbContainer = document.createElement('div');
    breadcrumbContainer.className = 'breadcrumb-container';
    breadcrumbContainer.style.cssText = `
      margin-bottom: 20px;
      padding: 10px 0;
    `;
    
    header.appendChild(breadcrumbContainer);
    this.setupBreadcrumbs();
  }

  // Método para mostrar dicas de navegação
  showNavigationTips() {
    const userRole = this.currentUser?.role;
    if (!userRole) return;

    const tips = document.createElement('div');
    tips.className = 'navigation-tips';
    tips.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-size: 12px;
      max-width: 200px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    tips.innerHTML = `
      <strong>Dicas de Navegação:</strong><br>
      • Ctrl + 1-5: Navegação rápida<br>
      • ESC: Voltar ao início<br>
      • Clique nos links da sidebar
    `;
    
    document.body.appendChild(tips);
    
    // Mostra por 3 segundos
    setTimeout(() => {
      tips.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
      tips.style.opacity = '0';
      setTimeout(() => {
        if (tips.parentNode) {
          tips.remove();
        }
      }, 300);
    }, 3000);
  }
}

// Inicializa o sistema de navegação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o dataManager está disponível
  if (typeof window.dataManager !== 'undefined') {
    window.navigationManager = new NavigationManager();
  }
});
