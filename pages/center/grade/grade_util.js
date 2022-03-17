// 分数转换为绩点
function score2point(score, calculation_rule) {
    if (score.startsWith('优'))
        score = 95
    else if (score.startsWith('良') || score === '合格')
        score = 85
    else if (score.startsWith('中'))
        score = 75
    else if (score === '及格')
        score = 65
    else if (score === '不及格' || score === '不合格')
        score = 50
    if (score < 0 || score > 100 || isNaN(score)) return ''
    else {
        if (calculation_rule === 'four') {
            if (score < 60) return 0
            if (score >= 90) return 4
            let a = score % 10 * 0.1
            let b = parseInt(score / 10) - 6 + 1
            return a + b
        } else if (calculation_rule === 'five') {
            if (score < 60) return 0
            let a = score % 10 * 0.1
            let b = parseInt(score / 10) - 6 + 1
            return a + b
        }
    }
}

module.exports = {
    score2point,
}