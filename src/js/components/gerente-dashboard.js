document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o usuário está logado
  const currentUser = window.dataManager.getCurrentUser();
  if (!currentUser || currentUser.role !== 'gerente') {
    window.location.href = 'login.html';
    return;
  }

  loadDashboardData();
  setupNavigation();
  setupLogoutButton();
  setupBreadcrumbs();
});

function loadDashboardData() {
  const currentUser = window.dataManager.getCurrentUser();
  const stats = window.dataManager.getStats();
  const ranking = window.dataManager.getRanking();
  
  // Atualiza informações do usuário
  updateUserInfo(currentUser);
  
  // Atualiza estatísticas
  updateStats(stats);
  
  // Atualiza ranking de funcionários
  updateEmployeeRanking(ranking);
}

function updateUserInfo(user) {
  const userName = document.querySelector('.user-name');
  const userPosition = document.querySelector('.user-position');
  
  if (userName) userName.textContent = user.name;
  if (userPosition) userPosition.textContent = user.position;
}

function updateStats(stats) {
  // Atualiza vendas totais
  const salesElement = document.querySelector('.stat-item:nth-child(2) h2');
  if (salesElement) {
    salesElement.textContent = `R$ ${stats.totalSales.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
  }
  
  // Atualiza cross-sell (simulado)
  const crossSellElement = document.querySelector('.stat-item:nth-child(3) h2');
  if (crossSellElement) {
    const crossSellValue = Math.floor(stats.totalItems * 0.8);
    crossSellElement.innerHTML = `${crossSellValue.toLocaleString()} <span class="unit">vendidos</span>`;
  }
  
  // Atualiza ticket médio
  const ticketElement = document.querySelector('.stat-item:nth-child(4) h2');
  if (ticketElement && stats.totalItems > 0) {
    const ticketMedio = stats.totalSales / stats.totalItems;
    ticketElement.textContent = `R$ ${ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
  }
}

function updateEmployeeRanking(ranking) {
  const employeeList = document.querySelector('.employee-sales-list');
  if (!employeeList) return;
  
  // Limpa lista existente
  employeeList.innerHTML = '';
  
  // Adiciona funcionários do ranking
  ranking.slice(0, 4).forEach((employee, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'employee-item';
    
    const salesAmount = Math.random() * 100000 + 50000; // Simula vendas
    const salesPercentage = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    listItem.innerHTML = `
      <div class="employee-info">
        <span class="initial-circle">${employee.name.charAt(0)}</span>
        <span class="employee-name">${employee.name}</span>
      </div>
      <div class="sales-data">
        <span class="sales-amount">R$ ${salesAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        <span class="sales-percentage">${salesPercentage}%</span>
      </div>
    `;
    
    employeeList.appendChild(listItem);
  });
}

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active de todos os itens
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Adiciona active ao item clicado
      this.parentElement.classList.add('active');
      
      // Navegação baseada no link
      const linkText = this.querySelector('span').textContent;
      navigateToPage(linkText);
    });
  });
}

function navigateToPage(pageName) {
  switch(pageName) {
    case 'Painel Gerente':
      // Já está na página
      break;
    case 'Ranking Regional':
      window.location.href = 'ranking-regional.html';
      break;
    case 'Disputas':
      window.location.href = 'gerente-disputa.html';
      break;
    case 'Gestão de Missões':
      window.location.href = 'gerente-missao.html';
      break;
    case 'Gestão de Vendas':
      window.location.href = 'gestao-vendas.html';
      break;
  }
}

function setupLogoutButton() {
  // Adiciona botão de logout na sidebar
  const sidebarFooter = document.querySelector('.sidebar-footer');
  if (sidebarFooter) {
    const logoutButton = document.createElement('a');
    logoutButton.href = '#';
    logoutButton.className = 'settings-link';
    logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Sair</span>';
    
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Tem certeza que deseja sair?')) {
        window.dataManager.logout();
      }
    });
    
    sidebarFooter.appendChild(logoutButton);
  }
}

function setupBreadcrumbs() {
  // Adiciona breadcrumbs se o sistema de navegação estiver disponível
  if (window.navigationManager) {
    window.navigationManager.addBreadcrumbsToPage();
  }
}