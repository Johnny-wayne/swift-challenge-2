document.addEventListener('DOMContentLoaded', () => {
    const btnVendedor = document.getElementById('btnVendedor');
    const btnGerente = document.getElementById('btnGerente');
    const loginForm = document.getElementById('loginForm');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');

    function selectRole(selectedButton) {
        // Remove a classe 'active' de ambos os botões
        btnVendedor.classList.remove('active');
        btnGerente.classList.remove('active');

        // Adiciona a classe 'active' ao botão clicado
        selectedButton.classList.add('active');

        // Mostra o formulário de login
        loginForm.classList.remove('hidden');
    }

    // Adiciona os eventos de clique aos botões de seleção de perfil
    btnVendedor.addEventListener('click', () => {
        selectRole(btnVendedor);
    });

    btnGerente.addEventListener('click', () => {
        selectRole(btnGerente);
    });

    // Adiciona um evento de submit ao formulário
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const selectedRole = btnVendedor.classList.contains('active') ? 'vendedor' : 'gerente';

        // Validação básica
        if (!email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Verifica se o gerenciador de dados está disponível
        if (typeof window.dataManager === 'undefined') {
            showMessage('Sistema de dados não carregado. Recarregue a página.', 'error');
            return;
        }

        // Tenta fazer login
        const result = window.dataManager.login(email, password);
        
        if (result.success) {
            // Verifica se o perfil selecionado corresponde ao usuário
            if (result.user.role !== selectedRole) {
                showMessage(`Este usuário é ${result.user.role === 'gerente' ? 'Gerente' : 'Vendedor'}. Selecione o perfil correto.`, 'error');
                return;
            }

            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Redireciona baseado no perfil
            setTimeout(() => {
                if (result.user.role === 'gerente') {
                    window.location.href = 'gerente-dashboard.html';
                } else {
                    window.location.href = 'mission.html';
                }
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    });

    // Função para mostrar mensagens
    function showMessage(message, type = 'info') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.textContent = message;
        
        // Estilos da mensagem
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            text-align: center;
            ${type === 'error' ? 'background-color: #fee; color: #c33; border: 1px solid #fcc;' : ''}
            ${type === 'success' ? 'background-color: #efe; color: #363; border: 1px solid #cfc;' : ''}
            ${type === 'info' ? 'background-color: #eef; color: #336; border: 1px solid #ccf;' : ''}
        `;

        loginForm.appendChild(messageDiv);

        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Adiciona dicas de login para facilitar o teste
    const loginHint = document.createElement('div');
    loginHint.className = 'login-hint';
    loginHint.innerHTML = `
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666;">
            <strong>Contas para teste:</strong><br>
            <strong>Gerente:</strong> gerente@swift.com / 123456<br>
            <strong>Vendedor:</strong> vendedor@swift.com / 123456<br>
            <strong>Vendedor 2:</strong> maria@swift.com / 123456
        </div>
    `;
    loginForm.appendChild(loginHint);
});