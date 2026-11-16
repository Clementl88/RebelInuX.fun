// js/tokenomics.js — Tokenomics page functionality (v3.2)

document.addEventListener('DOMContentLoaded', function () {
  console.log('Tokenomics page loaded (v3.2)');

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
// CHART — Token Supply Distribution (50% Public / 50% Protocol)
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
      type: 'doughnut',
      data: {
        labels: [
          'Public Supply (50%)',
          'Protocol Reserves (50%)'
        ],
        datasets: [{
          data: [50, 50],
          backgroundColor: [
            'rgba(215, 77, 77, 0.9)',      // Red — Public Supply
            'rgba(156, 39, 176, 0.9)'      // Purple — Protocol Reserves
          ],
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: window.innerWidth <= 768 ? 'bottom' : 'right',
            labels: {
              color: 'white',
              padding: 20,
              usePointStyle: true,
              font: {
                family: 'Montserrat',
                size: 13
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ' ' + context.label;
              }
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
          <tr><td>Public Supply:</td><td>50%</td></tr>
          <tr><td>Protocol Reserves:</td><td>50%</td></tr>
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
