var pointSet = [
[
    [[1, 2], [3, 4], [0, 3], [4, 2], [5, 2], [9, 4]],
    [[2, 3], [3, 5], [7, 2], [3, 1], [6, 6], [7,6]]
],
[
    [[-12.5,0], [-2.5,0], [-6,-3.5]],
    [[2.5,2.5], [10.5,4.5], [8,5.5]]
]
][0]


var margin = { top: 10, right: 10, bottom: 30, left: 30 }


var svg = d3.select("#graph").append("g")


inBox = new Vue({
    el: '#panel',
    data: {
        set1: pointSet[0],
        set2: pointSet[1],
        pop1: false,
        pop2: false,
        result: false,
        allCircle: false,
        selectedRow1: -1,
        selectedRow2: -1,
        maxDiff: { diff:0, cir:[], points:[], s1:0, s2:0 }
    },
    created() {
        this.update()
    },
    methods: {
        add1() {
            if (x1.value != "" && y1.value != ""
                && this.set1.indexOf([Number(x1.value), Number(y1.value)]) == -1)
            {
                this.set1.push([Number(x1.value), Number(y1.value)])
                x1.value = y1.value = ""
                this.update()
            }
        },
        add2() {
            if (x2.value != "" && y2.value != ""
                && this.set2.indexOf([Number(x2.value), Number(y2.value)]) == -1)
            {
                this.set2.push([Number(x2.value), Number(y2.value)])
                x2.value = y2.value = ""
                this.update()
            }
        },
        edit1() {
            if (edx2.value != "" && edy2.value != ""
                && this.set1.indexOf([Number(edx2.value), Number(edy2.value)]) == -1)
            {
                this.set1[this.selectedRow1][0] = Number(edx2.value)
                this.set1[this.selectedRow1][1] = Number(edy2.value)
                this.selectedRow1 = -1
                this.pop2 = false
                this.update()
            }
        },
        edit2() {
            if (edx1.value != "" && edy1.value != ""
                && this.set2.indexOf([edx1.value, edy1.value]) == -1)
            {
                this.set2[this.selectedRow2][0] = edx1.value
                this.set2[this.selectedRow2][1] = edy1.value
                this.selectedRow1 = -1
                this.pop2 = false
                this.update()
            }
        },
        del1() {
            this.set1.splice(this.selectedRow1, 1);
            this.selectedRow1 = -1
            this.pop2 = false
            this.update()
        },
        del2() {
            this.set2.splice(this.selectedRow2, 1);
            this.selectedRow2 = -1
            this.pop1 = false
            this.update()
        },
        delall1() {
            this.set1 = []
            this.update()
        },
        delall2() {
            this.set2 = []
            this.update()
        },
        popup(set, i) {
            if (set == 1) {
                this.selectedRow1 = i
                this.pop2 = true
            }
            else {
                this.selectedRow2 = i
                this.pop1 = true
            }
        },
        update() {
            console.log("set1", this.set1, "set2", this.set2)

            var n1 = this.set1.length
            var n2 = this.set2.length
            var circle1, circle2

            this.maxDiff.diff = 0

            if (n1 >= 3 && n2 >= 3) {
                circle1 = findAllSet(this.set1)
                circle2 = findAllSet(this.set2)
                this.maxDiff = findMaxDiff(circle1, circle2)
                console.log(this.maxDiff)
            }
            
            var width = window.innerWidth * 3 / 4 - margin.left - margin.right - 40
            var height = window.innerHeight - margin.top - margin.bottom - 40
            svg.remove("g")
            svg = d3.select("#graph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var xmax, xmin, ymax, ymin
            if (this.maxDiff.diff) {
                xmax = Math.max(...this.set1.map(x => x[0]), ...this.set2.map(x => x[0]),
                    this.maxDiff.cir[0].r + this.maxDiff.cir[0].x,
                    this.maxDiff.cir[1].r + this.maxDiff.cir[1].x)
                xmin = Math.min(...this.set1.map(x => x[0]), ...this.set2.map(x => x[0]),
                    -this.maxDiff.cir[0].r + this.maxDiff.cir[0].x,
                    -this.maxDiff.cir[1].r + this.maxDiff.cir[1].x)
                ymax = Math.max(...this.set1.map(x => x[1]), ...this.set2.map(x => x[1]),
                    this.maxDiff.cir[0].r + this.maxDiff.cir[0].y,
                    this.maxDiff.cir[1].r + this.maxDiff.cir[1].y)
                ymin = Math.min(...this.set1.map(x => x[1]), ...this.set2.map(x => x[1]),
                    -this.maxDiff.cir[0].r + this.maxDiff.cir[0].y,
                    -this.maxDiff.cir[1].r + this.maxDiff.cir[1].y)
            } else {
                xmax = Math.max(...this.set1.map(x => x[0]), ...this.set2.map(x => x[0]))
                xmin = Math.min(...this.set1.map(x => x[0]), ...this.set2.map(x => x[0]))
                ymax = Math.max(...this.set1.map(x => x[1]), ...this.set2.map(x => x[1]))
                ymin = Math.min(...this.set1.map(x => x[1]), ...this.set2.map(x => x[1]))
            }


            var s = Math.max((xmax - xmin) / width, (ymax - ymin) / height)

            var xScale = d3.scaleLinear().domain([xmin, s * width + xmin]).range([0, width]);
            var yScale = d3.scaleLinear().domain([ymin, s * height + ymin]).range([height, 0]);

            var dataset1 = d3.range(n1).map(d => { return {"x": this.set1[d][0], "y": this.set1[d][1]} })
            var dataset2 = d3.range(n2).map(d => { return {"x": this.set2[d][0], "y": this.set2[d][1]} })


            var line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y))

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft


            if (n1 >= 3 && n2 >= 3 && this.maxDiff.diff && this.result) {
                if (this.allCircle) {
                    svg.selectAll(".cir1")
                        .data(circle1)
                        .enter().append("circle")
                        .attr("class", "cir")
                        .attr("cx", d => xScale(d.x))
                        .attr("cy", d => yScale(d.y))
                        .attr("r", d => d.r / s)
                        .attr("opacity", "0.04")

                    svg.selectAll(".cir2")
                        .data(circle2)
                        .enter().append("circle")
                        .attr("class", "cir")
                        .attr("cx", d => xScale(d.x))
                        .attr("cy", d => yScale(d.y))
                        .attr("r", d => d.r / s)
                        .attr("opacity", "0.01")
                }

                svg.append("path")
                    .datum([this.maxDiff.points.A, this.maxDiff.points.C, this.maxDiff.cir[1], this.maxDiff.points.D, this.maxDiff.points.B, this.maxDiff.cir[0], this.maxDiff.points.A])
                    .attr("class", "line") 
                    .attr("d", line)
                    .on("click", d => { console.log(d) })

                
                svg.selectAll(".result")
                    .data(this.maxDiff.cir)
                    .enter().append("circle")
                    .attr("class", "result")
                    .attr("cx", d => xScale(d.x))
                    .attr("cy", d => yScale(d.y))
                    .attr("r", d => d.r / s)
                    .on("mouseover", function (a, b, c) {
                        this.setAttribute("class", "result resultfocus")
                    })
                    .on("mouseout", function () {
                        this.setAttribute("class", "result")
                    })
                    .on("click", d => { console.log(d) })
            
                svg.selectAll(".point")
                    .data(Object.values(this.maxDiff.points))
                    .enter().append("circle")
                    .attr("class", "point")
                    .attr("cx", d => xScale(d.x))
                    .attr("cy", d => yScale(d.y))
                    .attr("r", 3)
                    .on("mouseover", function (a, b, c) {
                        this.setAttribute("class", "point focus")
                    })
                    .on("mouseout", function () {
                        this.setAttribute("class", "point")
                    })
                    .on("click", d => { console.log(d) })
            }


            svg.selectAll(".dot1")
                .data(dataset1)
                .enter().append("circle")
                .attr("class", "dot1")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 5)
                .on("mouseover", function () {
                    this.setAttribute("class", "dot1 focus")
                })
                .on("mouseout", function () {
                    this.setAttribute("class", "dot1")
                })
                .on("click", d => { console.log(d) })

            svg.selectAll(".dot2")
                .data(dataset2)
                .enter().append("circle")
                .attr("class", "dot2")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 5)
                .on("mouseover", function () {
                    this.setAttribute("class", "dot2 focus")
                })
                .on("mouseout", function () {
                    this.setAttribute("class", "dot2")
                })
                .on("click", d => { console.log(d) })
        }
    },
})

