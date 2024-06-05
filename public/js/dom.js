const defaultInput4 = 'min = 150x1 + 230x2 + 260x3 \nx1 + x2 + x3 <= 500\n2.5x1 + x2 - x3 >= 200\n3x2 + x1 >= 240\nx1 - 20x3 <= 0\nx3 <= 6000'
const defaultInput = 'max = 1x1 + 2x2\n1x1 + 3x2 >= 11\n2x1 + 1x2 >= 9'
const defaultInput7 = 'min = 80x1 + 60x2\n0.2x1 + 0.32x2<=0.25\n1x1+1x2<=1'
const defaultInput2 = 'max = 3000x1 + 2000x2 \n2x1 + 1x2 <= 100 \n1x1 + 1x2 <= 80 \n1x2 <= 40'
const defaultInput3 = 'max = 22x1 + 45x2 \n1x1 - 3x2 <= 42\n4x1 - 8x2 <= 40\n0.5x1 + 1x2 <= 15'
const defaultInputMax = 'max = 60x1 + 80x2 \n6x1 + 6x2 <= 300\n5x1 + 10x2 <= 400\n8x1 + 4x2 <= 320'
const defaultInput6 = 'min = 60x1 + 80x2 \n6x1 + 6x2 <= 300\n5x1 + 10x2 <= 400\n8x1 + 4x2 <= 320'
const defaultInput5 = 'min = 1.5x1 + 2.5x2 \n2x1 + 1x2 <= 90\n1x1 + 1x2 >= 50\n1x1 <= 10'



let loquesea = "150x1 + 230x2 + 260x3 + 60x4 + 48x5 + 69x6 + 11x7 + 9x8 + 2002x9 + 14x10 + 9x11 + 2012x12 + 54x13 + 54x14 + 54x15 + 54x16 + 54x17 + 15x18 + 54x19 + 15x20"
//Para acceder a cada elemento que tiene un id en index.html 
const problem = document.getElementById('problem')
const solve = document.getElementById('solve')
const metodo = document.getElementById('method-select')
const output = document.getElementById('output')    
const btnReset = document.getElementById('reset')
const emptyMsg = document.getElementById('empty-msg')
const historyModal = document.querySelector('#history-modal')
const historyBody = document.querySelector('#history-modal .modal-card-body')

problem.value = defaultInput

const reset$ = () => {
    $ = {
        maxIter: 50,
        iobj: undefined,
        irows: [],
        variables: [],
        pivots: [],
        target: undefined,
        rVector: undefined,
        matrixA: undefined,
        costVector: [],
        p1CostVector: undefined,
        basicVars: undefined,
        basis: undefined,
        cBFS: undefined,
        dim: undefined,
        rCost: undefined,
        minmaxRCost: undefined,
        minmaxRCostIndex: undefined,
        ratio: undefined,
        leavingIndex: undefined,
        kount: 1,
        objZ: undefined,
        basicKount: 0,
        nonBasicKount: 0,
        artificialKount: 0,
        unbounded: undefined,
        history: [],
    }
}

const createNode = (tag, classList, innerText) => {
    const node = document.createElement(tag)
    if (classList) node.classList.add(...classList)
    if (innerText) node.innerText = innerText
    return node
}

const clearOutput = (node) => {
    while (node.firstChild) {
        node.firstChild.remove()
    }
}

const resetCalculator = () => {
    problem.value = ''
    reset$()
    clearOutput(emptyMsg)
    clearOutput(output)
}

btnReset.addEventListener('click', resetCalculator)

const addToHistory = () => {
    const itemStr = localStorage.getItem(lclStorageKey)
    let item = JSON.parse(itemStr)
    const time = Date.now()
    const newH = {
        time,
        value: problem.value
    }
    if (!item) {
        item = [newH]
    } else {
        item.push(newH)
    }
    localStorage.setItem(lclStorageKey, JSON.stringify(item))
}

const calculationStart = () => {
    reset$()
    clearOutput(emptyMsg)
    clearOutput(output)
    addToHistory()
    solve.setAttribute('disabled', 'true')
    solve.classList.toggle('is-loading')
    btnReset.setAttribute('disabled', 'true')
}

const calculationEnd = () => {
    solve.removeAttribute('disabled')
    solve.classList.toggle('is-loading')
    btnReset.removeAttribute('disabled')
    output.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

const deleteHistory = (i) => {
    const itemStr = localStorage.getItem(lclStorageKey)
    const item = JSON.parse(itemStr)
    const newItem = item.slice(0, i).concat(item.slice(i + 1))
    localStorage.setItem(lclStorageKey, JSON.stringify(newItem))
    loadHistory()
}

const selectHistory = (i, value) => {
    resetCalculator()
    problem.value = value
    historyModal.classList.remove('is-active')
}

const clearHistory = () => {
    localStorage.removeItem(lclStorageKey)
    clearOutput(historyBody)
    const p = createNode('p', [], 'No history, start using to save history.')
    historyBody.appendChild(p)
}

const loadHistory = () => {
    const itemStr = localStorage.getItem(lclStorageKey)
    if (!itemStr) return

    clearOutput(historyBody)

    const delAllDiv = createNode('div', ['block', 'level'])

    const btn = createNode('button', ['level-right', 'button', 'is-danger'], 'Clear History')
    btn.addEventListener('click', clearHistory)
    delAllDiv.appendChild(btn)
    historyBody.appendChild(delAllDiv)

    const item = JSON.parse(itemStr)
    item.reverse()
    item.forEach((h, i) => {
        const div = createNode('div', ['card', 'block'])
        const header = createNode('header', ['card-header'])
        const p = createNode('p', ['card-header-title', 'has-background-grey-light'], new Date(h.time).toLocaleString())
        header.appendChild(p)
        div.appendChild(header)

        const body = createNode('div', ['card-content'], h.value)
        div.appendChild(body)

        const footer = createNode('footer', ['card-footer'])
        const select = createNode('a', ['card-footer-item'], 'Select')
        select.addEventListener('click', () => { selectHistory(i, h.value) })
        const del = createNode('a', ['card-footer-item', 'has-text-danger'], 'Delete')
        del.addEventListener('click', () => { deleteHistory(i) })

        footer.appendChild(select)
        footer.appendChild(del)
        div.appendChild(footer)
        historyBody.appendChild(div)
    })
}


const guideDetails = document.querySelectorAll('#guide .details')

solve.addEventListener('click', getProblem)

document.addEventListener('DOMContentLoaded', () => {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
    $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
            const target = el.dataset.target
            const $target = document.getElementById(target)
            el.classList.toggle('is-active')
            $target.classList.toggle('is-active')
        })
    })
    function openModal($el) {
        $el.classList.add('is-active')
        if ($el.getAttribute('id') === 'history-modal') loadHistory()
    }
    function closeModal($el) {
        $el.classList.remove('is-active')
    }
    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal)
        })
    }
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target
        const $target = document.getElementById(modal)
        $trigger.addEventListener('click', () => {
            openModal($target)
        })
    })
    document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').forEach(($close) => {
        const $target = $close.closest('.modal')
        $close.addEventListener('click', () => {
            closeModal($target)
        })
    })
    document.addEventListener('keydown', (event) => {
        const e = event || window.event
        if (e.keyCode === 27) { // Escape key
            closeAllModals()
        }
    })
})

const printTableHeadStandardForm = () => {
    const thead = createNode('thead')
    const tr = createNode('tr')
    $.variables.forEach(v => {
        const th = createNode('th', [], v)
        tr.appendChild(th)
    })
    thead.appendChild(tr)
    return thead
}

const printTableStandardForm = () => {
    const table = createNode('table', ['table', 'is-narrow'])
    const head = printTableHeadStandardForm()
    table.appendChild(head)
    const tbody = createNode('tbody')

    $.matrixA.forEach(row => {
        const tr = createNode('tr')
        row.forEach(col => {
            const td = createNode('td', [], `${checkDecimals(col)}`)
            tr.appendChild(td)
        })
        tbody.appendChild(tr)
    })
    table.appendChild(tbody)
    return table
}

const printTableCardStandardForm = (txt) => {
    const card = createNode('div', ['card', 'block'])
    const header = createNode('header', ['card-header'])
    const title = createNode('p', ['card-header-title', 'has-background-danger-light','has-text-weight-bold'], txt)
    header.appendChild(title)
    card.appendChild(header)

    const contentContainer = createNode('div', ['card-content'])
    const content = createNode('div', ['content', 'overflow-scroll'])

    const table = printTableStandardForm()
    content.appendChild(table)

    contentContainer.appendChild(content)
    card.appendChild(contentContainer)
    output.appendChild(card)
}

const printVariables = (q) => {
    const vars = q === 'Basic' ? $.variables : $.variables.slice($.basicKount)
    const txt = vars.join(', ')
    const div = createNode('div', ['block'], `${q} variables: ${txt}`)
    output.appendChild(div)
}

const printTableHeadBFS = () => {
    const thead = createNode('thead')
    const tr = createNode('tr')
    $.variables.forEach(v => {
        const th = createNode('th', [], v)
        tr.appendChild(th)
    })
    thead.appendChild(tr)
    return thead
}

const printTableBFS = () => {
    const table = createNode('table', ['table', 'is-narrow'])
    const head = printTableHeadBFS()
    table.appendChild(head)
    const tbody = createNode('tbody')
    const tr = createNode('tr')
    $.cBFS.forEach(s => {
        const td = createNode('td', [], `${checkDecimals(s)}`)
        tr.appendChild(td)
    })
    tbody.appendChild(tr)
    table.appendChild(tbody)
    return table
}

const printBFS = () => {
    const div = createNode('div', ['message'])
    const header = createNode('div', ['message-header'])
    const p = createNode('p', [], 'Current basic feasible solution (BFS)')
    header.appendChild(p)
    div.appendChild(header)

    const body = createNode('div', ['message-body', 'overflow-scroll'])
    const table = printTableBFS()
    body.appendChild(table)

    const soln = createNode('div', ['block'])
    const z = createNode('strong', [], `Z = ${checkDecimals($.objZ)}`)
    soln.appendChild(z)
    body.appendChild(soln)
    div.appendChild(body)
    output.appendChild(div)
}

const printSubtitle = (txt) => {
    const div = createNode('div', ['notification', 'has-background-danger', 'has-text-weight-bold', 'has-text-white'])
    const p = createNode('p', ['subtitle'], txt)
    div.appendChild(p)
    output.appendChild(div)
}

const printEnteringLeavingTxt = (txt1, txt2) => {
    const div = createNode('div', ['message', 'is-dark'])
    const body = createNode('div', ['message-body'])

    const p1 = createNode('p')
    const b1 = createNode('b', [], txt1)
    p1.appendChild(b1)
    body.appendChild(p1)

    const p2 = createNode('p')
    const b2 = createNode('b', [], txt2)
    p2.appendChild(b2)
    body.appendChild(p2)

    div.appendChild(body)
    return div
}

const printWarning = (msg, target) => {
    const div = createNode('div', ['notification', 'is-warning'])
    const p = createNode('p', [], msg)
    div.appendChild(p)
    target.appendChild(div)
}

const printHeaderRowCol = (arr) => {
    return arr.map(c => {
        const th = createNode('th', [], c)
        return th
    })
}

const printHeaderNumRowCol = (arr, cls) => {
    return arr.map(c => {
        const th = createNode('th', [], `${checkDecimals(c)}`)
        if (cls) th.classList.add('has-background-white-ter')
        return th
    })
}

const printTableHead = (phase) => {
    const thead = createNode('thead')
    const cBasis = createNode('th', [], 'current\nbasis')
    cBasis.setAttribute('rowspan', 2)
    const cBasicVars = createNode('th', [], 'basic\nvariable')
    cBasicVars.setAttribute('rowspan', 2)
    const b = createNode('th', [], 'b')
    b.setAttribute('rowspan', 2)

    const p1CVRow = phase == 1 ? printHeaderNumRowCol($.p1CostVector) : printHeaderNumRowCol($.costVector)
    const vRow = printHeaderRowCol($.variables)

    const tr1 = createNode('tr', ['has-background-white-ter'])
    tr1.appendChild(cBasis)
    tr1.appendChild(cBasicVars)
    p1CVRow.forEach(r => tr1.appendChild(r))
    tr1.appendChild(b)
    const tr2 = createNode('tr', ['has-background-white-ter'])
    vRow.forEach(r => tr2.appendChild(r))
    thead.appendChild(tr1)
    thead.appendChild(tr2)
    return thead
}

const printTableFoot = () => {
    const tfoot = createNode('tfoot')
    const cjbar = createNode('th', [], 'Costo relativo ')
    cjbar.setAttribute('colspan', 2)
    const rCostRow = printHeaderNumRowCol($.rCost)
    const tr = createNode('tr', ['has-background-white-ter'])
    tr.appendChild(cjbar)
    rCostRow.forEach(r => tr.appendChild(r))
    tfoot.appendChild(tr)
    return tfoot
}

const printTable = (phase) => {
    const table = createNode('table', ['table', 'is-narrow'])
    const head = printTableHead(phase)
    const foot = printTableFoot()
    table.appendChild(head)
    table.appendChild(foot)

    const tbody = createNode('tbody')
    const matrixTable = $.matrixA.map(row => row.map(col => createNode('td', [], `${checkDecimals(col)}`)))

    const cb = printHeaderNumRowCol($.basis, 'has-background-white-ter')
    const cbv = printHeaderRowCol($.basicVars, 'has-background-white-ter')
    const rv = printHeaderNumRowCol($.rVector, 'has-background-white-ter')

    for (let i = 0; i < $.dim[0]; i++) {
        const tr = createNode('tr')
        tr.appendChild(cb[i])
        tr.appendChild(cbv[i])
        matrixTable[i].forEach(col => tr.appendChild(col))
        tr.appendChild(rv[i])
        tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    return table
}


const printTableCard = (phase) => {
    const card = createNode('div', ['card', 'block'])
    const header = createNode('header', ['card-header'])
    const title = createNode('p', ['card-header-title', 'has-background-grey-lighter'], `Fase ${phase}, iteración: ${$.kount}`)
    header.appendChild(title)
    card.appendChild(header)
    const contentContainer = createNode('div', ['card-content'])
    const content = createNode('div', ['content', 'overflow-scroll'])
    const table = printTable(phase)
    content.appendChild(table)
    contentContainer.appendChild(content)
    card.appendChild(contentContainer)
    output.appendChild(card)
    return card
}

const printRatio = (card) => {
    const trHead = card.querySelector('thead tr')
    const th = createNode('th', [], 'ratio')
    th.setAttribute('rowspan', 2)
    trHead.appendChild(th)

    const trBody = card.querySelectorAll('tbody tr')
    trBody.forEach((tr, i) => {
        const r = $.ratio[i]
        const txt = isFinite(r) ? `${checkDecimals(r)}` : 'infinity'
        const th = createNode('th', ['has-background-white-ter'], txt)
        tr.appendChild(th)
    })
}

const printEnteringLeavingVar = (card) => {
    const rows = card.querySelectorAll('tbody tr')
    rows[$.leavingIndex].classList.add('has-background-grey-lighter')
    rows.forEach((row, i) => {
        const td = row.querySelectorAll('td')[$.minmaxRCostIndex]
        if (i === $.leavingIndex) {
            td.classList.add('has-background-grey-light')
            return
        }
        td.classList.add('has-background-grey-lighter')
    })
    const thRCost = card.querySelectorAll('tfoot tr th')[$.minmaxRCostIndex + 1]
    thRCost.classList.add('has-background-grey-lighter')

    const word = $.target === 'min' ? 'lowest' : 'highest'
    const ev1 = `Entering variable: Among all the relative cost`
    const ev2 = `${checkDecimals($.minmaxRCost)} is ${word}`
    const ev3 = `So ${$.variables[$.minmaxRCostIndex]} is the entering variable`
    const ev = `${ev1}, ${ev2}. ${ev3}.`

    const lv1 = `Leaving variable: Among all the ratios`
    const lv2 = `${checkDecimals($.ratio[$.leavingIndex])} is lowest`
    const lv3 = `So ${$.basicVars[$.leavingIndex]} is the leaving variable`
    const lv = `${lv1}, ${lv2}. ${lv3}.`

    const block = printEnteringLeavingTxt(ev, lv)
    card.appendChild(block)
}

const printAnswer = () => {
    const title = createNode('div', ['notification', 'has-background-primary', 'has-text-white'])
    const p = createNode('p', ['subtitle'], 'Final solution')
    title.appendChild(p)
    output.appendChild(title)

    const div = createNode('div', ['message'])
    const body = createNode('div', ['message-body', 'overflow-scroll'])
    const table = printTableBFS()
    body.appendChild(table)

    const soln = createNode('div', ['block'])
    const z = createNode('strong', [], `Z = ${checkDecimals($.objZ)}`)
    soln.appendChild(z)
    body.appendChild(soln)

    const iter = createNode('div', ['block'], `Iterations taken: ${$.kount}`)
    body.appendChild(iter)
    div.appendChild(body)
    output.appendChild(div)
}

document.getElementById('lista').addEventListener('change', function(){
    const informacionAdicional = document.getElementById('informacionAdicional');
    if (this.checked){
        informacionAdicional.classList.remove("hidden");    
    } else {
        informacionAdicional.classList.add("hidden");
    }
});