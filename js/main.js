console.log('Starting up');

var gProjs = [
    {
        id: 1,
        name: 'Sokoban',
        title: 'Better push those boxes',
        desc: 'Push boxes to their targets. try not to get stuck.',
        url: ['img/portfolio/sokoban-full.png', 'img/portfolio/sokoban-thumbnail.png'],
        link: 'http://127.0.0.1:5500/projs/Sokoban/sokoban.html',
        publishedAt: 'Feburary 2018',
        labels: ['Matrixes', 'keyboard events']
    }, {
        id: 2,
        name: 'Minesweeper',
        title: 'Try not to blow up!',
        desc: 'reveal cells, without hitting the mines.',
        url: ['img/portfolio/minesweeper-full.png', 'img/portfolio/minesweeper-thumbnail.png'],
        link: 'http://127.0.0.1:5500/projs/Minesweeper/minesweeper.html',
        publishedAt:  'Feburary 2018',
        labels: ['Matrixes']
    }, {
        id: 3,
        name: 'Memory Logos',
        title: "Match the logos",
        desc: 'Click on pairs of cards to find two that match.',
        url: ['img/portfolio/memory-game-full.png', 'img/portfolio/memory-game-thumbnail.png'],
        link: 'http://127.0.0.1:5500/projs/memoryLogos-startHere/game.html',
        publishedAt:  'March 2018',
        labels: ['Cards', 'Memory']
    }
]

function initPage() {
    renderPortfolios($('.portfolio-container'));
   renderModals($('.modal-container'));
}

function renderPortfolios($elPortfolio) {
    var strHtml = '';
    gProjs.forEach(function (proj, idx) {
        strHtml += `
        <div class="col-md-4 col-sm-6 portfolio-item" id="portfolio${idx + 1}">
            <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${idx + 1}">
            <div class="portfolio-hover">
                <div class="portfolio-hover-content">
                <i class="fa fa-plus fa-3x"></i>
                </div>
            </div>
            <img class="img-fluid" src="${proj.url[1]}" alt="">
            </a>
            <div class="portfolio-caption">
                <h4>${proj.name}</h4>
                <p class="text-muted">${proj.title}</p>
            </div>
        </div>
        `
    });
    $elPortfolio.html(strHtml);
}

function renderModals($elModal) {
    var strHtml = '';
    
    gProjs.forEach(function (proj, idx) {
        var badgesStr = ''
        proj.labels.forEach(label => {
            var badgeStr = `<span class="badge">${label}</span> `
            badgesStr += badgeStr;
        });
        strHtml += `
        <div class="portfolio-modal modal fade" id="portfolioModal${idx + 1}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="close-modal" data-dismiss="modal">
          <div class="lr">
            <div class="rl"></div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="modal-body">
                <h2>${proj.name}</h2>
                <p class="title item-intro text-muted">${proj.title}</p>
                <img class="img-fluid d-block mx-auto" src="${proj.url[0]}" alt="">
                <p class="description">${proj.desc} <a href="${proj.link}">Play game</a></p>
                <ul class="list-inline">
                  <li>Date:
                    <span class="date">${proj.publishedAt}</span>
                  </li>
                  <li>Categories:
                    <span class="labels">${badgesStr}</span>
                  </li>
                </ul>
                <button class="btn btn-primary" data-dismiss="modal" type="button">
                  <i class="fa fa-times"></i>
                  Close Project</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        `
    });
    $elModal.html(strHtml);
}
$('.portfolio-container').html(renderPortfolios($('.portfolio-container')))
$('.modal-container').html(renderModals($('.modal-container')))
$(document).ready(initPage())