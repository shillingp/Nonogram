/*jshint browser: true, devel: true, loopfunc: true  */

var svg,mouseState,gapWidth,tileSize,gridStart,gridSize,bias,solGrid,currGrid;

function nonogram() {
    svg = document.getElementById("svgElement");
    mouseState = false;
    gapWidth = 5;
    tileSize = 35;
    gridStart = tileSize*2;
    gridSize = 5;
    bias = 0.75;
    solGrid = [];
    currGrid = [];

    function setAttributes(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    function svgCreate(elem) {
        return document.createElementNS("http://www.w3.org/2000/svg", elem);
    }

    function drawTile(x, y, sol, color) {
        var tile = svgCreate("rect");
        if (!color) color = "#eaeaea";
        setAttributes(tile,
                      {
                          "x": x + gridStart,
                          "y": y + gridStart,
                          "width": tileSize,
                          "height": tileSize,
                          "sol": sol,
                          "curr": 0,
                          "flag": 0,
                          "fill": color
                      });
        svg.appendChild(tile);
    }

    function drawGrid() {
        for (var i=0,x=0,y=0;i<gridSize*gridSize;i++,x++) {
            if (x == gridSize) x = 0;
            if (i !== 0 && i % gridSize === 0) y++;
            solGrid[i] = Math.round(Math.pow(Math.random(), bias)).toString();
            drawTile(x*(tileSize+gapWidth), y*(tileSize+gapWidth), solGrid[i]);
        }
    }

    function islandCalc(a) {
        var n = 0,
            m = [];
        for (var i=0;i<a.length;i++) {   
            if (a[i] == 1) {
                n++;
            }
            if (a[i] == "0" && n > 0 || i == a.length-1 && n > 0) {
                m.push(n);
                n = 0;
            }
        }
        if (m.length === 0) {
            m.push(0);
        }
        return m;
    }

    function flagWrite(a, b) {
        for (var i=0;i<a.length;i++) {
            if (b.getAttribute("flag") == "0") {
                a[i].setAttribute("flag", 1);
            } else {
                a[i].setAttribute("flag", 0);
            }
        }
        update();
    }

    function horzText(rect) {
        var textList = svg.querySelectorAll("rect[x='"+rect.getAttribute("x")+"']"),
            a = [];
        for (var i=0;i<gridSize;i++) {  
            a.push(textList[i].getAttribute("sol"));
            rect.parentElement.onclick = function(){flagWrite(textList, rect);};
        }
        return a;
    }

    function vertText(rect) {
        var textList = svg.querySelectorAll("rect[y='"+rect.getAttribute("y")+"']"),
            a = [];
        for (var i=0;i<gridSize;i++) {
            a.push(textList[i].getAttribute("sol"));
            rect.parentElement.onclick = function(){flagWrite(textList, rect);};
        }
        return a;
    }

    function solTile(x, y, deg) {
        var group = svg.appendChild(svgCreate("g")),
            rect = group.appendChild(svgCreate("rect")),
            text = group.appendChild(svgCreate("text"));
        setAttributes(rect, 
                      {
                          "x": x,
                          "y": y,
                          "width": (tileSize*2)-gapWidth,
                          "height": tileSize,
                          "fill": "#eaeaea",
                          "transform": "rotate("+deg+","+x+",0)",
                          "flag": 0
                      });
        setAttributes(text, 
                      {
                          "x": x+gapWidth,
                          "y": y+(tileSize/2)+gapWidth,
                          "transform": "rotate("+deg+","+x+",0)"
                      });
        if (rect.getAttribute("x") == "0") {
            text.textContent = islandCalc(vertText(rect));
        } else {
            text.textContent = islandCalc(horzText(rect));
        }
    }

    function writeClues() {
        var size = function(a){return a*(tileSize+gapWidth)+gridStart;};
        for (var i=0;i<gridSize;i++) {
            solTile(size(i),-tileSize,90);
            solTile(0,size(i),0);
        }
    }

    function update() {
        var grid = document.querySelectorAll("svg>rect");
        for (var i=0;i<grid.length;i++) {
            currGrid[i] = grid[i].getAttribute("curr");
        }
        if (currGrid.toString() == solGrid.toString()) { alert("Win");}
    }

    function toggleFlag() {
        var a = event.target;
        if (a.getAttribute("curr") == 1) {
            setAttributes(a,
                          {
                              "curr": 0,
                              "flag": 1
                          });
        } else if (a.getAttribute("flag") == 1) {
            a.setAttribute("flag", 0);
        } else {
            a.setAttribute("flag", 1);
        }
        update();
    }

    function toggleTile() {
        var a = event.target;
        if (a.getAttribute("curr") == 1) {
            setAttributes(a,
                          {
                              "curr": 0,
                              "flag": 0
                          });
        } else {
            a.setAttribute("curr", 1);
        }
        update();    
    }

    function mouseClick() {
        if (event.button === 0) toggleTile();
        else if (event.button === 2) toggleFlag();
    }

    function mouseDrag() {
        if (mouseState === true && event.button === 0) toggleTile();
        else if (mouseState === true && event.button === 2) toggleFlag();
    }

    function mouseEvent() {
        var grid = document.querySelectorAll("svg>rect");
        for (var i=0;i<grid.length;i++) {
            grid[i].onmousedown = mouseClick;
            grid[i].onmouseover = mouseDrag;
        }
    }

    function docSettings() {
        document.onmousedown = function(){mouseState=true;};
        document.onmouseup = function(){mouseState=false;};
        document.oncontextmenu = function(){return false;};
        svg.style.width = svg.style.height = gridStart+(tileSize+gapWidth)*gridSize;
    }

    function gameManager() {
        docSettings();
        drawGrid();
        writeClues();
        mouseEvent();
    }

    gameManager();
}

document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        nonogram();
    }
};
nonogram();