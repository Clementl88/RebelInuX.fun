// js/tokenomics.js — Tokenomics page functionality (v3.0)

document.addEventListener('DOMContentLoaded', function () {
  console.log('Tokenomics page loaded (v3.0)');

  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }, 500);

  initializeAccordion();
  initializeTokenomicsChart();
  setupBackToTop();
  matchAccordionColorsToButtons();
});

// ============================================================================
// ACCORDION
// ============================================================================
function initializeAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (!accordionHeaders.length) {
    console.warn('No accordion headers found');
    return;
  }

  accordionHeaders.forEach((header, index) => {
    header.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const content = this.nextElementSibling;
      if (!content || !content.classList.contains('accordion-content')) {
        console.error('Next sibling is not accordion-content');
        return;
      }

      const isActive = content.classList.contains('active');

      if (isActive) {
        content.classList.remove('active');
        this.classList.remove('active');
      } else {
        content.classList.add('active');
        this.classList.add('active');

        setTimeout(() => {
          content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });

  const expandAllBtn = document.getElementById('expandAll');
  const collapseAllBtn = document.getElementById('collapseAll');

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('active'));
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.add('active'));
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
    });
  }

  console.log(`Accordion initialized with ${accordionHeaders.length} items`);
}

// ============================================================================
// MATCH ACCORDION COLORS TO BUTTONS
// ============================================================================
function matchAccordionColorsToButtons() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const buttons = item.querySelectorAll('.accordion-content .cta-button');
    const accordionColor = Array.from(item.classList).find(cls => cls.startsWith('color-'));

    if (accordionColor) {
      buttons.forEach(button => button.classList.add(accordionColor));
    }
  });
}

// ============================================================================
// CHART
// ============================================================================
function initializeTokenomicsChart() {
  const ctx = document.getElementById('distributionChart');
  if (!ctx) {
    console.warn('Distribution chart canvas not found');
    showFallbackChart();
    return;
  }

  try {
    if (window.tokenomicsChart) {
      window.tokenomicsChart.destroy();
    }

    window.tokenomicsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Public Distribution (70%)',
          'ZORA Rewards Treasury (17%)',
          'Team Fund (7%)',
          'Ecosystem Fund (6%)'
        ],
        datasets: [{
          data: [70, 17, 7, 6],
          backgroundColor: [
            'rgba(255, 51, 102, 0.9)',     // Red — Public Distribution
            'rgba(156, 39, 176, 0.9)',     // Purple — ZORA Rewards
            'rgba(75, 192, 192, 0.9)',     // Teal — Team Fund
            'rgba(255, 206, 86, 0.9)'      // Yellow — Ecosystem Fund
          ],
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: window.innerWidth <= 768 ? 'bottom' : 'right',
            labels: {
              color: 'white',
              padding: 15,
              usePointStyle: true
            }
          }
        }
      }
    });

    console.log('Chart initialized');
  } catch (error) {
    console.error('Chart initialization failed:', error);
    showFallbackChart();
  }
}

function showFallbackChart() {
  const chartContainer = document.querySelector('.chart-wrapper');
  if (!chartContainer) return;

  chartContainer.innerHTML = `
    <div class="chart-fallback">
      <div class="fallback-icon"><i class="fas fa-chart-pie"></i></div>
      <h4>Token Distribution</h4>
      <div class="fallback-data">
        <table>
          <tr><td>Public Distribution:</td><td>70%</td></tr>
          <tr><td>ZORA Rewards Treasury:</td><td>17%</td></tr>
          <tr><td>Team Fund:</td><td>7%</td></tr>
          <tr><td>Ecosystem Fund:</td><td>6%</td></tr>
        </table>
      </div>
    </div>
  `;
}

// ============================================================================
// BACK TO TOP
// ============================================================================
function setupBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.pageYOffset > 300);
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================================
// RESIZE — chart legend position
// ============================================================================
window.addEventListener('resize', function () {
  if (window.tokenomicsChart) {
    window.tokenomicsChart.options.plugins.legend.position =
      window.innerWidth <= 768 ? 'bottom' : 'right';
    window.tokenomicsChart.resize();
    window.tokenomicsChart.update();
  }
});
