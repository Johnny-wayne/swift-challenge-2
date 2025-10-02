document.addEventListener('DOMContentLoaded', () => {
  const categoryData = [
    { label: 'Açaí', value: 40, color: '#8e44ad' },
    { label: 'Lanches', value: 25, color: '#1abc9c' },
    { label: 'Bebidas', value: 20, color: '#27ae60' },
    { label: 'Sobremesas', value: 10, color: '#f39c12' },
    { label: 'Outros', value: 5, color: '#e74c3c' },
  ];

  createDoughnutChart(categoryData);
  createLegend(categoryData);
});

function createDoughnutChart(data) {
  const svg = document.getElementById('categoryChart');
  if (!svg) return;

  const strokeWidth = 15;
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedValue = 0;

  data.forEach(item => {
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
    const dashLength = (item.value / 100) * circumference;
    const offset = (accumulatedValue / 100) * circumference;

    arc.setAttribute('cx', '50');
    arc.setAttribute('cy', '50');
    arc.setAttribute('r', radius);
    arc.setAttribute('fill', 'none');
    arc.setAttribute('stroke', item.color);
    arc.setAttribute('stroke-width', strokeWidth);
    arc.setAttribute('stroke-dasharray', `${dashLength} ${circumference}`);
    // O -25 é para rotacionar o início do gráfico para o topo
    arc.setAttribute('transform', `rotate(${(offset / circumference) * 360 - 90} 50 50)`);
    
    svg.appendChild(arc);
    accumulatedValue += item.value;
  });
}

function createLegend(data) {
  const legendList = document.querySelector('.legend-list');
  if (!legendList) return;

  data.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('legend-item');

    const dot = document.createElement('span');
    dot.classList.add('legend-dot');
    dot.style.backgroundColor = item.color;

    const label = document.createElement('span');
    label.classList.add('legend-label');
    label.textContent = item.label;

    const percentage = document.createElement('span');
    percentage.classList.add('legend-percentage');
    percentage.textContent = `${item.value}%`;

    li.appendChild(dot);
    li.appendChild(label);
    li.appendChild(percentage);
    legendList.appendChild(li);
  });
}