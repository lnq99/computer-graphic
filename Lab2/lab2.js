var margin = { top: 10, right: 10, bottom: 30, left: 30 }
xmax = 100
xmin = 0
ymax = 100
ymin = 0

var svg = d3.select("#graph").append("g")


mycat = new Cat(40, 40)
console.log(mycat)

inBox = new Vue({
    el: '#panel',
    data: {
        log: [],
        log_index: -1
    },
    created() {
        this.update()
    },
    methods: {
        translate() {
            var dx = Number(in_dx.value)
            var dy = Number(in_dy.value)
            if (dx == 0 || dy == 0 || dx > 50 || dx < -50 || dy > 50 || dy < -50)
                return
            mycat.translate(dx, dy)
            this.update()
            this.log_index++
            this.log.length = this.log_index
            this.log.push(["translate", [dx, dy]])
        },
        scale() {
            var c = { x: Number(in_x1.value), y: Number(in_y1.value) }
            kx = Number(in_kx.value)
            ky = Number(in_ky.value)
            if (kx < -2 || ky < -2 || kx > 2 || ky > 2 || kx == 0 || ky == 0)
                return
            mycat.scale(c, kx, ky)
            this.update()
            this.log_index++
            this.log.length = this.log_index
            this.log.push(["scale", [c, kx, ky]])
        },
        rotate() {
            var a = Number(in_angle.value) / 180 * Math.PI
            var c = { x: Number(in_x2.value), y: Number(in_y2.value) }
            if (a == 0)
                return
            mycat.rotate(c, a)
            this.update()
            this.log_index++
            this.log.length = this.log_index
            this.log.push(["rotate", [c, a]])
        },
        undo() {
            console.log(this.log, this.log_index)
            if (this.log_index == -1)
                return
            var action = this.log[this.log_index][0]
            var vars = this.log[this.log_index][1]

            if (!action.localeCompare("translate"))
                mycat.translate(-vars[0], -vars[1])
            else if (!action.localeCompare("scale"))
                mycat.scale(vars[0], 1/vars[1], 1/vars[2])
            else if (!action.localeCompare("rotate"))
                mycat.rotate(vars[0], -vars[1])

            this.update()
            this.log_index--
        },
        redo() {
            console.log(this.log, this.log_index)
            if (this.log_index + 1 == this.log.length)
                return

            this.log_index++
            var action = this.log[this.log_index][0]
            var vars = this.log[this.log_index][1]

            if (!action.localeCompare("translate"))
                mycat.translate(vars[0], vars[1])
            else if (!action.localeCompare("scale"))
                mycat.scale(vars[0], vars[1], vars[2])
            else if (!action.localeCompare("rotate"))
                mycat.rotate(vars[0], vars[1])

            this.update()
        },
        update() {
            var width = window.innerWidth * 5 / 6 - margin.left - margin.right - 40
            var height = window.innerHeight - margin.top - margin.bottom - 40
            var s = Math.max((xmax - xmin) / width, (ymax - ymin) / height)

            svg.remove("g")
            svg = d3.select("#graph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            xScale = d3.scaleLinear()
                .domain([xmin, s * width + xmin])
                .range([0, width]);

            yScale = d3.scaleLinear()
                .domain([ymin, s * height + ymin])
                .range([height, 0])


            var line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y))

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale))

            svg.append("path")
                .datum(mycat.ears)
                .attr("class", "line") 
                .attr("d", line);


            svg.selectAll("ellipse")
                .data([mycat.body, mycat.head])
                .enter().append("ellipse")
                .attr("class", "catfur")
                .attr("cx", d => xScale(d.c.x))
                .attr("cy", d => yScale(d.c.y))
                .attr("rx", d => d.rx / s)
                .attr("ry", d => d.ry / s)
                .attr("transform", d => "rotate(" + d.angle / Math.PI * 180 + " " + xScale(d.c.x) + " " + yScale(d.c.y) + ")")

            svg.selectAll("eye")
                .data(mycat.eyes)
                .enter().append("ellipse")
                .attr("class", "eye")
                .attr("cx", d => xScale(d.c.x))
                .attr("cy", d => yScale(d.c.y))
                .attr("rx", d => d.rx / s)
                .attr("ry", d => d.ry / s)
                .attr("transform", d => "rotate(" + d.angle / Math.PI * 180 + " " + xScale(d.c.x) + " " + yScale(d.c.y) + ")")
            
            mycat.mouth.forEach(d => {
                svg.append("path")
                    .datum(d)
                    .attr("class", "mouth") 
                    .attr("d", line);
            });

            svg.selectAll(".dot1")
                .data([mycat.neck])
                .enter().append("circle")
                .attr("class", "dot1")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 5)


            console.log(mycat)
        },
        update2() {
            svg.selectAll("ellipse")
                .attr("cx", d => xScale(70))
                .attr("transform", "rotate(45 " + xScale(40) + " " + yScale(40) + ")")

            console.log(svg)
        }
    },
})

