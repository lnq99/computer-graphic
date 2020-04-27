Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}

Array.prototype.indexOf = function (thing) {
    if (!this)
        return -1;

    var result = -1;
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array)
            if (this[i].equals(thing))
                result = i;
            else
                if (this[i] === thing)
                    result = i;
    }
    return result;
}


function findCenter(p1, p2, p3)
{
    var m1 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
    var m2 = [(p1[0] + p3[0]) / 2, (p1[1] + p3[1]) / 2]
    var n1 = [(p2[0] - p1[0]), (p2[1] - p1[1])]
    var n2 = [(p3[0] - p1[0]), (p3[1] - p1[1])]

    if (n1[0]*n2[1] - n1[1]*n2[0] == 0)
        return

    var p = (n1[0]*n2[1]*m1[0] - n2[0]*n1[1]*m2[0] + n1[1]*n2[1]*(m1[1]-m2[1]))
    var q = (n1[0]*n2[1] - n1[1]*n2[0])
    var x = p / q

    var y1 = -n1[0]*(x-m1[0])/n1[1] + m1[1]
    var y2 = -n2[0]*(x-m2[0])/n2[1] + m2[1]
    var y = y1 || y2
    // console.log(...p1, ...p2, ...p3, ' ', y1, y2)
    
    var r = Math.sqrt((x-p1[0]) ** 2 + (y-p1[1]) ** 2)
    return { "x": x, "y": y, "r": r }
}

function findAllSet(set)
{
    var circle = []
    for (var i = 0; i < set.length; i++)
        for (var j = i + 1; j < set.length; j++)
            for (var k = j + 1; k < set.length; k++)
            {
                var tmp = findCenter(set[i], set[j], set[k])
                if (tmp)
                    circle.push(tmp)
            }
    return circle
}

function caclDiffArea(cir1, cir2)
{
    var d = Math.sqrt((cir1.x - cir2.x) ** 2 + (cir1.y - cir2.y) ** 2)
    if (d <= cir1.r + cir2.r)
        return
    var d1 = d*cir1.r / (cir1.r+cir2.r)
    var d2 = d - d1
    
    var s1 = cir1.r/2 * Math.sqrt(d1**2 - cir1.r**2)
    var s2 = cir2.r/2 * Math.sqrt(d2**2 - cir2.r**2)

    return [2 * Math.abs(s1 - s2), 2*s1, 2*s2]
}

function findMaxDiff(set1, set2)
{
    var diff
    var maxDiff = { "diff": 0, "cir": [] }
    for (cir1 of set1)
    {
        for (cir2 of set2)
        {
            diff = caclDiffArea(cir1, cir2)
            // console.log(diff)
            if (diff && diff[0] > maxDiff.diff)
            {
                maxDiff.diff = diff[0]
                maxDiff.cir[0] = cir1
                maxDiff.cir[1] = cir2
                maxDiff.s1 = diff[1]
                maxDiff.s2 = diff[2]
            }
        }
    }
    if (maxDiff.diff)
    {
        console.log("Max", maxDiff.cir)
        maxDiff.points = findTangent(...maxDiff.cir)
    }

    return maxDiff
}

function findTangent(cir1, cir2)
{
    var dx = cir2.x - cir1.x
    var dy = cir2.y - cir1.y
    var d = Math.sqrt((dx) ** 2 + (dy) ** 2)
    var d1 = d*cir1.r / (cir1.r+cir2.r)
    var M = {}, H = {}, A = {}, B = {}, C = {}, D = {}
    M.x = cir1.x + d1 / d * dx
    M.y = cir1.y + d1 / d * dy
    var a1 = cir1.r ** 2 / d1
    H.x = cir1.x + a1 / d * dx
    H.y = cir1.y + a1 / d * dy
    var h = Math.sqrt(cir1.r ** 2 - a1 ** 2)
    A.x = H.x + -dy * h / d
    A.y = H.y + dx * h / d
    B.x = H.x - -dy * h / d
    B.y = H.y - dx * h / d
    C.x = A.x + (M.x - A.x) / d1 * d
    C.y = A.y + (M.y - A.y) / d1 * d
    D.x = B.x + (M.x - B.x) / d1 * d
    D.y = B.y + (M.y - B.y) / d1 * d
    return { "M":M, "A":A, "B":B, "C":C, "D":D }
}