(function (a, b, c) {

    function d(b) {
        var g = a(this),
        h = g.closest(":data(" + f + ")");
        if (h.length) {
            var c = arguments,
            d = h.data(f).options;
            if (!d.disabled) {
                var h = g.attr(d.paramsAttr),
                o = b.type.substr(0, 1).toUpperCase() + b.type.substr(1),
                q = d.controller[d.actionPrefix + a.trim(g.attr(d.actionAttr)) + o],
                o = d.controller[d.actionPrefix + d.defaultAction + o],
                g = d.context ? "element" === d.context ? g[0] : d.context : d.controller;
                h ? (h = a.map(h.split(","), function (b) {
                    return a.trim(b)
                }), h = n.call(c, 0).concat(h)) : h = c;
                if ("function" === typeof o && !1 ===
                    o.apply(g, h)) return !1;
                    if ("function" === typeof q) return q.apply(g, h)
                }
        }
    }
    var f = "actionController",
    g = a(b),
    h = {}, n = Array.prototype.slice,
    b = {
        controller: c,
        events: "click",
        context: "element",
        actionAttr: "data-action",
        paramsAttr: "data-params",
        actionPrefix: "",
        defaultAction: "action",
        disabled: !1
    };
    a.fn[f] = function (b, g) {
        "object" === typeof b && (g = b, b = null);
        var h;
        this.each(function () {
            var c = a.data(this, f) || a.data(this, f, new a[f](this, g));
            b && (h = c[b](g))
        });
        return h || this
    };
    a[f] = function (b, c) {
        var n = a.extend({}, a[f].defaults,
            c),
        m = "";
        this.element = a(b);
        this.options = n;
        a.each(n.events.split(" "), function (a, b) {
            h[b] && 0 < h[b] ? h[b]++ : (h[b] = 1, m += b + " ")
        });
        m && g.delegate("[" + n.actionAttr + "]", m, d)
    };
    a[f].defaults = b;
    a[f].prototype = {
        destroy: function () {
            var b = this.options;
            a.each(b.events.split(" "), function (a, c) {
                1 < h[c] ? h[c]-- : g.undelegate("[" + b.actionAttr + "]", c, d)
            });
            this.element.removeData(f)
        },
        enable: function () {
            this.options.disabled = !1
        },
        disable: function () {
            this.options.disabled = !0
        }
    };
    a.expr[":"].data = function (b, g, h) {
        return !!a.data(b, h[3])
    }
})(jQuery,window.document);
(function (a, b) {
    var c = b.event,
    d;
    c.special.smartresize = {
        setup: function () {
            b(this).bind("resize", c.special.smartresize.handler)
        },
        teardown: function () {
            b(this).unbind("resize", c.special.smartresize.handler)
        },
        handler: function (a, b) {
            var h = this,
            c = arguments;
            a.type = "smartresize";
            d && clearTimeout(d);
            d = setTimeout(function () {
                jQuery.event.handle.apply(h, c)
            }, "execAsap" === b ? 0 : 100)
        }
    };
    b.fn.smartresize = function (a) {
        return a ? this.bind("smartresize", a) : this.trigger("smartresize", ["execAsap"])
    };
    b.Mason = function (a, g) {
        this.element =
        b(g);
        this._create(a);
        this._init()
    };
    b.Mason.settings = {
        isResizable: !0,
        isAnimated: !1,
        animationOptions: {
            queue: !1,
            duration: 500
        },
        gutterWidth: 0,
        isRTL: !1,
        isFitWidth: !1,
        containerStyle: {
            position: "relative"
        }
    };
    b.Mason.prototype = {
        _filterFindBricks: function (a) {
            var b = this.options.itemSelector;
            return !b ? a : a.filter(b).add(a.find(b))
        },
        _getBricks: function (a) {
            return this._filterFindBricks(a).css({
                position: "absolute"
            }).addClass("masonry-brick")
        },
        _create: function (c) {
            this.options = b.extend(!0, {}, b.Mason.settings, c);
            this.styleQueue = [];
            c = this.element[0].style;
            this.originalStyle = {
                height: c.height || ""
            };
            var g = this.options.containerStyle,
            h;
            for (h in g) this.originalStyle[h] = c[h] || "";
                this.element.css(g);
            this.horizontalDirection = this.options.isRTL ? "right" : "left";
            this.offset = {
                x: parseInt(this.element.css("padding-" + this.horizontalDirection), 10),
                y: parseInt(this.element.css("padding-top"), 10)
            };
            this.isFluid = this.options.columnWidth && "function" === typeof this.options.columnWidth;
            var d = this;
            setTimeout(function () {
                d.element.addClass("masonry")
            },
            0);
            this.options.isResizable && b(a).bind("smartresize.masonry", function () {
                d.resize()
            });
            this.reloadItems()
        },
        _init: function (a) {
            this._getColumns();
            this._reLayout(a)
        },
        option: function (a) {
            b.isPlainObject(a) && (this.options = b.extend(!0, this.options, a))
        },
        layout: function (a, b) {
            for (var h = 0, c = a.length; h < c; h++) this._placeBrick(a[h]);
                c = {};
            c.height = Math.max.apply(Math, this.colYs);
            if (this.options.isFitWidth) {
                for (var d = 0, h = this.cols; --h && 0 === this.colYs[h];) d++;
                    c.width = (this.cols - d) * this.columnWidth - this.options.gutterWidth
            }
            this.styleQueue.push({
                $el: this.element,
                style: c
            });
            for (var d = !this.isLaidOut ? "css" : this.options.isAnimated ? "animate" : "css", l = this.options.animationOptions, j, h = 0, c = this.styleQueue.length; h < c; h++) j = this.styleQueue[h], j.$el[d](j.style, l);
                this.styleQueue = [];
            b && b.call(a);
            this.isLaidOut = !0
        },
        _getColumns: function () {
            var a = (this.options.isFitWidth ? this.element.parent() : this.element).width();
            this.columnWidth = this.isFluid ? this.options.columnWidth(a) : this.options.columnWidth || this.$bricks.outerWidth(!0) || a;
            this.columnWidth += this.options.gutterWidth;
            this.cols = Math.floor((a + this.options.gutterWidth) / this.columnWidth);
            this.cols = Math.max(this.cols, 1)
        },
        _placeBrick: function (a) {
            var a = b(a),
            g, h, c, d, l;
            g = Math.ceil(a.outerWidth(!0) / (this.columnWidth + this.options.gutterWidth));
            g = Math.min(g, this.cols);
            if (1 === g) c = this.colYs;
            else {
                h = this.cols + 1 - g;
                c = [];
                for (l = 0; l < h; l++) d = this.colYs.slice(l, l + g), c[l] = Math.max.apply(Math, d)
            }
        l = Math.min.apply(Math, c);
        h = g = 0;
        for (d = c.length; h < d; h++)
            if (c[h] === l) {
                g = h;
                break
            }
            c = {
                top: l + this.offset.y
            };
            c[this.horizontalDirection] = this.columnWidth *
            g + this.offset.x;
            this.styleQueue.push({
                $el: a,
                style: c
            });
            a = l + a.outerHeight(!0);
            c = this.cols + 1 - d;
            for (h = 0; h < c; h++) this.colYs[g + h] = a
        },
    resize: function () {
        var a = this.cols;
        this._getColumns();
        (this.isFluid || this.cols !== a) && this._reLayout()
    },
    _reLayout: function (a) {
        var b = this.cols;
        for (this.colYs = []; b--;) this.colYs.push(0);
            this.layout(this.$bricks, a)
    },
    reloadItems: function () {
        this.$bricks = this._getBricks(this.element.children())
    },
    reload: function (a) {
        this.reloadItems();
        this._init(a)
    },
    appended: function (a, b, c) {
        if (b) {
            this._filterFindBricks(a).css({
                top: this.element.height()
            });
            var d = this;
            setTimeout(function () {
                d._appended(a, c)
            }, 1)
        } else this._appended(a, c)
    },
    _appended: function (a, b) {
        var c = this._getBricks(a);
        this.$bricks = this.$bricks.add(c);
        this.layout(c, b)
    },
    remove: function (a) {
        this.$bricks = this.$bricks.not(a);
        a.remove()
    },
    destroy: function () {
        this.$bricks.removeClass("masonry-brick").each(function () {
            this.style.position = "";
            this.style.top = "";
            this.style.left = ""
        });
        var c = this.element[0].style,
        g;
        for (g in this.originalStyle) c[g] = this.originalStyle[g];
            this.element.unbind(".masonry").removeClass("masonry").removeData("masonry");
        b(a).unbind(".masonry")
    }
};
b.fn.imagesLoaded = function (a) {
    function g() {
        a.call(d, k)
    }

    function c(a) {
        a = a.target;
        a.src !== j && -1 === b.inArray(a, m) && (m.push(a), 0 >= --l && (setTimeout(g), k.unbind(".imagesLoaded", c)))
    }
    var d = this,
    k = d.find("img").add(d.filter("img")),
    l = k.length,
    j = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    m = [];
    l || g();
    k.bind("load.imagesLoaded error.imagesLoaded", c).each(function () {
        var a = this.src;
        this.src = j;
        this.src = a
    });
    return d
};
b.fn.imagesReady = function (a, b) {
    function c() {
        b.call(this,
            d)
    }
    var d = a,
    k = [],
    l = null,
    j = [
    ["width", "height"],
    ["naturalWidth", "naturalHeight"]
    ],
    m = Number("number" === typeof document.createElement("img").naturalHeight),
    p = function () {
        for (var a = 0; a < k.length; a++) k[a].end ? k.splice(a--, 1) : o.call(k[a], null);
            k.length && (l = setTimeout(p, 50)) || (l = null)
    }, o = function () {
        if (this[j[m][0]] !== this.__width || this[j[m][1]] !== this.__height || 1024 < this[j[m][0]] * this[j[m][1]]) this.onready.call(this, null), this.end = !0
    }, b = b || new Function;
d.onerror = function () {
    c();
    d.end = !0;
    d = d.onload = d.onerror =
    d.onreadystatechange = null
};
if (d)
    if (d.__width = d[j[m][0]], d.__height = d[j[m][1]], d.complete) c();
else return d.onready = function () {
    c()
}, o.call(d, null), d.onload = d.onreadystatechange = function () {
    if (!d || !d.readyState || !("loaded" != d.readyState && "complete" != d.readyState))!d.end && o.call(d, null), d = d.onload = d.onerror = d.onreadystatechange = null
}, d.end || (k.push(d), null === l && (l = setTimeout(p, 50))), d;
else c()
};
b.fn.imagesPreLoaded = function (a) {
    function g() {
        a.call(d, k)
    }

    function c(a) {
        a.src !== j && -1 === b.inArray(a, m) && (m.push(a),
            0 >= --l && setTimeout(g))
    }
    var d = this,
    k = d.find("img").add(d.filter("img")),
    l = k.length,
    j = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    m = [];
    l || g();
    k.each(function () {
        var a = this.src;
        this.src = j;
        this.src = a;
        b(this).imagesReady(this, c)
    });
    return d
};
b.fn.masonry = function (c) {
    if ("string" === typeof c) {
        var g = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
            var h = b.data(this, "masonry");
            h ? !b.isFunction(h[c]) || "_" === c.charAt(0) ? a.console && a.console.error("no such method '" + c + "' for masonry instance") :
            h[c].apply(h, g) : a.console && a.console.error("cannot call methods on masonry prior to initialization; attempted to call method '" + c + "'")
        })
    } else this.each(function () {
        var a = b.data(this, "masonry");
        a ? (a.option(c || {}), a._init()) : b.data(this, "masonry", new b.Mason(c, this))
    });
    return this
}
})(window, jQuery);
(function (a, b, c) {
    b.infinitescroll = function (a, c, d) {
        this.element = b(d);
        this._create(a, c) || (this.failed = !0)
    };
    b.infinitescroll.defaults = {
        loading: {
            finished: c,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
            img: "http://www.infinite-scroll.com/loading.gif",
            msg: null,
            msgText: "<em>Loading the next set of posts...</em>",
            selector: null,
            speed: "fast",
            start: c
        },
        state: {
            isDuringAjax: !1,
            isInvalidPage: !1,
            isDestroyed: !1,
            isDone: !1,
            isPaused: !1,
            currPage: 1
        },
        callback: c,
        debug: !1,
        behavior: c,
        binder: b(a),
        nextSelector: "div.navigation a:first",
        navSelector: "div.navigation",
        contentSelector: null,
        extraScrollPx: 250,
        itemSelector: "div.post",
        animate: !1,
        pathParse: c,
        dataType: "html",
        appendCallback: !0,
        bufferPx: 40,
        errorCallback: function () {},
        infid: 0,
        pixelsFromNavToBottom: c,
        resetPage: "0",
        path: c
    };
    b.infinitescroll.prototype = {
        _binding: function (a) {
            var b = this,
            d = b.options;
            d.v = "2.0b2.111027";
            if (d.behavior && this["_binding_" + d.behavior] !== c) this["_binding_" + d.behavior].call(this);
            else {
                if ("bind" !== a && "unbind" !== a) return this._debug("Binding value  " +
                    a + " not valid"), !1;
                    if ("unbind" == a) this.options.binder.unbind("smartscroll.infscr." + b.options.infid);
                else this.options.binder[a]("smartscroll.infscr." + b.options.infid, function () {
                    b.scroll()
                });
                    this._debug("Binding", a)
                }
            },
            _create: function (a, d) {
                var f = b.extend(!0, {}, b.infinitescroll.defaults, a);
                if (!this._validate(a)) return !1;
                this.options = f;
                var k = b(f.nextSelector).attr("href");
                if (!k) return this._debug("Navigation selector not found"), !1;
                f.path = this._determinepath(k);
                k = b(f.nextSelector).attr("data-reset");
                f.resetPage = k;
                f.contentSelector = f.contentSelector || this.element;
                f.loading.selector = f.loading.selector || f.contentSelector;
                f.loading.msg = b('<div id="infscr-loading"><img alt="Loading..." src="' + f.loading.img + '" /><div>' + f.loading.msgText + "</div></div>");
                (new Image).src = f.loading.img;
                f.pixelsFromNavToBottom = b(document).height() - b(f.navSelector).offset().top;
                f.loading.start = f.loading.start || function () {
                    b(f.navSelector).hide();
                    f.loading.msg.appendTo(f.loading.selector).show(f.loading.speed, function () {
                        beginAjax(f)
                    })
                };
                f.loading.finished = f.loading.finished || function () {
                    f.loading.msg.fadeOut("normal")
                };
                f.callback = function (a, g) {
                    f.behavior && a["_callback_" + f.behavior] !== c && a["_callback_" + f.behavior].call(b(f.contentSelector)[0], g);
                    d && d.call(b(f.contentSelector)[0], g, f)
                };
                this._setup();
                return !0
            },
            _debug: function () {
                if (this.options && this.options.debug) return a.console && console.log.call(console, arguments)
            },
        _determinepath: function (a) {
            var b = this.options;
            if (b.behavior && this["_determinepath_" + b.behavior] !== c) this["_determinepath_" +
                b.behavior].call(this, a);
            else {
                if (b.pathParse) return this._debug("pathParse manual"), b.pathParse(a, this.options.state.currPage + 1);
                if (a.match(/^(.*?)\b2\b(.*?$)/)) a = a.match(/^(.*?)\b2\b(.*?$)/).slice(1);
                else if (a.match(/^(.*?)2(.*?$)/)) {
                    if (a.match(/^(.*?page=)2(\/.*|$)/)) return a = a.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    a = a.match(/^(.*?)2(.*?$)/).slice(1)
                } else {
                    if (a.match(/^(.*?page=)1(\/.*|$)/)) return a = a.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    this._debug("Sorry, we couldn't parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.");
                    b.state.isInvalidPage = !0
                }
                this._debug("determinePath", a);
                return a
            }
        },
        _error: function (a) {
            var b = this.options;
            b.behavior && this["_error_" + b.behavior] !== c ? this["_error_" + b.behavior].call(this, a) : ("destroy" !== a && "end" !== a && (a = "unknown"), this._debug("Error", a), "end" == a && this._showdonemsg(), b.state.isDone = !0, b.state.currPage = 1, b.state.isPaused = !1, this._binding("unbind"))
        },
        _loadcallback: function (g, d) {
            var f = this.options,
            k = this.options.callback,
            l = f.state.isDone ? "done" : !f.appendCallback ? "no-append" : "append";
            if (f.behavior &&
                this["_loadcallback_" + f.behavior] !== c) this["_loadcallback_" + f.behavior].call(this, g, d);
                else {
                    switch (l) {
                        case "done":
                        return this._showdonemsg(), !1;
                        case "no-append":
                        "html" == f.dataType && (d = b("<div>" + d + "</div>").find(f.itemSelector));
                        break;
                        case "append":
                        this._debug("data changed!", g);
                        if (l = b(g).find(f.nextSelector)) {
                            var j = b(l).attr("href"),
                            m = b(l).attr("data-reset");
                            j && (this._debug("path changed!"), f.path = this._determinepath(j));
                            f.resetPage = "1" == m ? "1" : "0";
                            b(l).remove();
                            (l = b(g).find(f.navSelector)) && b(l).remove()
                        }
                        b(g).find(".extra") &&
                        this._debug("found extra");
                        j = g.children();
                        if (0 == j.length) return this._error("end");
                        for (l = document.createDocumentFragment(); g[0].firstChild;) l.appendChild(g[0].firstChild);
                            this._debug("contentSelector", b(f.contentSelector)[0]);
                        b(f.contentSelector)[0].appendChild(l);
                        d = j.get()
                    }
                    f.loading.finished.call(b(f.contentSelector)[0], f);
                    f.animate && (l = b(a).scrollTop() + b("#infscr-loading").height() + f.extraScrollPx + "px", b("html,body").animate({
                        scrollTop: l
                    }, 800, function () {
                        f.state.isDuringAjax = !1
                    }));
                    f.animate || (f.state.isDuringAjax = !1);
                    k(this, d)
                }
            },
            _nearbottom: function () {
                var g = this.options,
                d = 0 + b(document).height() - g.binder.scrollTop() - b(a).height();
                if (g.behavior && this["_nearbottom_" + g.behavior] !== c) return this["_nearbottom_" + g.behavior].call(this);
                this._debug("math:", d, g.pixelsFromNavToBottom);
                return d - g.bufferPx < g.pixelsFromNavToBottom
            },
            _pausing: function (a) {
                var b = this.options;
                if (b.behavior && this["_pausing_" + b.behavior] !== c) this["_pausing_" + b.behavior].call(this, a);
                else {
                    "pause" !== a && ("resume" !== a && null !== a) && this._debug("Invalid argument. Toggling pause value instead");
                    switch (a && ("pause" == a || "resume" == a) ? a : "toggle") {
                        case "pause":
                        b.state.isPaused = !0;
                        break;
                        case "resume":
                        b.state.isPaused = !1;
                        break;
                        case "toggle":
                        b.state.isPaused = !b.state.isPaused
                    }
                    this._debug("Paused", b.state.isPaused);
                    return !1
                }
            },
            _setup: function () {
                var a = this.options;
                if (a.behavior && this["_setup_" + a.behavior] !== c) this["_setup_" + a.behavior].call(this);
                else return this._binding("bind"), !1
            },
        _showdonemsg: function () {
            var a = this.options;
            a.behavior && this["_showdonemsg_" + a.behavior] !== c ? this["_showdonemsg_" + a.behavior].call(this) :
            (a.loading.msg.find("img").hide().parent().find("div").html(a.loading.finishedMsg).animate({
                opacity: 1
            }, 2E3, function () {
                b(this).parent().fadeOut("normal")
            }), a.errorCallback.call(b(a.contentSelector)[0], "done"))
        },
        _validate: function (a) {
            for (var c in a)
                if (c.indexOf && -1 < c.indexOf("Selector") && 0 === b(a[c]).length) return this._debug("Your " + c + " found no elements."), !1;
            return !0
        },
        bind: function () {
            this._binding("bind")
        },
        destroy: function () {
            this.options.state.isDestroyed = !0;
            return this._error("destroy")
        },
        pause: function () {
            this._pausing("pause")
        },
        resume: function () {
            this._pausing("resume")
        },
        retrieve: function (a) {
            var d = this,
            f = d.options,
            k = f.path,
            l, j, m, p, a = a || null;
            beginAjax = function (a) {
                "1" == a.resetPage && (a.state.currPage = 0);
                a.state.currPage++;
                d._debug("heading into ajax", k);
                l = b(a.contentSelector).is("table") ? b("<tbody/>") : b("<div/>");
                j = k.join(a.state.currPage);
                m = "html" == a.dataType || "json" == a.dataType ? a.dataType : "html+callback";
                a.appendCallback && "html" == a.dataType && (m += "+callback");
                switch (m) {
                    case "html+callback":
                    d._debug("Using HTML via .load() method");
                    l.load(j + " " + a.itemSelector, null, function (a) {
                        d._loadcallback(l, a)
                    });
                    break;
                    case "html":
                    case "json":
                    d._debug("Using " + m.toUpperCase() + " via $.ajax() method"), b.ajax({
                        url: j,
                        dataType: a.dataType,
                        complete: function (a, b) {
                            (p = typeof a.isResolved !== "undefined" ? a.isResolved() : b === "success" || b === "notmodified") ? d._loadcallback(l, a.responseText) : d._error("end")
                        }
                    })
                }
            };
            if (f.behavior && this["retrieve_" + f.behavior] !== c) this["retrieve_" + f.behavior].call(this, a);
            else {
                if (f.state.isDestroyed) return this._debug("Instance is destroyed"), !1;
                f.state.isDuringAjax = !0;
                f.loading.start.call(b(f.contentSelector)[0], f)
            }
        },
        scroll: function () {
            var a = this.options,
            b = a.state;
            a.behavior && this["scroll_" + a.behavior] !== c ? this["scroll_" + a.behavior].call(this) : !b.isDuringAjax && !b.isInvalidPage && !b.isDone && !b.isDestroyed && !b.isPaused && this._nearbottom() && this.retrieve()
        },
        toggle: function () {
            this._pausing()
        },
        unbind: function () {
            this._binding("unbind")
        },
        update: function (a) {
            b.isPlainObject(a) && (this.options = b.extend(!0, this.options, a))
        }
    };
    b.fn.infinitescroll = function (a,
        c) {
        switch (typeof a) {
            case "string":
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var c = b.data(this, "infinitescroll");
                if (!c || !b.isFunction(c[a]) || "_" === a.charAt(0)) return !1;
                c[a].apply(c, d)
            });
            break;
            case "object":
            this.each(function () {
                var d = b.data(this, "infinitescroll");
                d ? d.update(a) : (d = new b.infinitescroll(a, c, this), d.failed || b.data(this, "infinitescroll", d))
            })
        }
        return this
    };
    var d = b.event,
    f;
    d.special.smartscroll = {
        setup: function () {
            b(this).bind("scroll", d.special.smartscroll.handler)
        },
        teardown: function () {
            b(this).unbind("scroll", d.special.smartscroll.handler)
        },
        handler: function (a, c) {
            var d = this,
            k = arguments;
            a.type = "smartscroll";
            f && clearTimeout(f);
            f = setTimeout(function () {
                b.event.handle.apply(d, k)
            }, "execAsap" === c ? 0 : 100)
        }
    };
    b.fn.smartscroll = function (a) {
        return a ? this.bind("smartscroll", a) : this.trigger("smartscroll", ["execAsap"])
    }
})(window, jQuery);
(function (a, b, c) {
    function d() {
        h = b[n](function () {
            f.each(function () {
                var b = a(this),
                g = b.width(),
                c = b.height(),
                d = a.data(this, l);
                if (g !== d.w || c !== d.h) b.trigger(k, [d.w = g, d.h = c])
            });
            d()
        }, g[j])
    }
    var f = a([]),
    g = a.resize = a.extend(a.resize, {}),
    h, n = "setTimeout",
    k = "resize",
    l = k + "-special-event",
    j = "delay";
    g[j] = 250;
    g.throttleWindow = !0;
    a.event.special[k] = {
        setup: function () {
            if (!g.throttleWindow && this[n]) return !1;
            var b = a(this);
            f = f.add(b);
            a.data(this, l, {
                w: b.width(),
                h: b.height()
            });
            1 === f.length && d()
        },
        teardown: function () {
            if (!g.throttleWindow &&
                this[n]) return !1;
                var b = a(this);
            f = f.not(b);
            b.removeData(l);
            f.length || clearTimeout(h)
        },
        add: function (b) {
            function d(b, g, h) {
                var k = a(this),
                n = a.data(this, l);
                n.w = g !== c ? g : k.width();
                n.h = h !== c ? h : k.height();
                f.apply(this, arguments)
            }
            if (!g.throttleWindow && this[n]) return !1;
            var f;
            if (a.isFunction(b)) return f = b, d;
            f = b.handler;
            b.handler = d
        }
    }
})(jQuery, this);
var Mustache = "undefined" !== typeof module && module.exports || {};
(function (a) {
    function b(a) {
        return ("" + a).replace(/&(?!\w+;)|[<>"']/g, function (a) {
            return C[a] || a
        })
    }

    function c(a, b, g, c) {
        for (var c = c || "<template>", d = b.split("\n"), f = Math.max(g - 3, 0), h = Math.min(d.length, g + 3), d = d.slice(f, h), k = 0, n = d.length; k < n; ++k) h = k + f + 1, d[k] = (h === g ? " >> " : "    ") + d[k];
            a.template = b;
        a.line = g;
        a.file = c;
        a.message = [c + ":" + g, d.join("\n"), "", a.message].join("\n");
        return a
    }

    function d(a, b, g) {
        if ("." === a) return b[b.length - 1];
        for (var a = a.split("."), c = a.length - 1, d = a[c], f, h, k = b.length, n, l; k;) {
            l = b.slice(0);
            h = b[--k];
            for (n = 0; n < c;) {
                h = h[a[n++]];
                if (null == h) break;
                l.push(h)
            }
            if (h && "object" === typeof h && d in h) {
                f = h[d];
                break
            }
        }
        "function" === typeof f && (f = f.call(l[l.length - 1]));
        return null == f ? g : f
    }

    function f(a, b, g, c) {
        var f = "",
        a = d(a, b);
        if (c) {
            if (null == a || !1 === a || o(a) && 0 === a.length) f += g()
        } else if (o(a)) q(a, function (a) {
            b.push(a);
            f += g();
            b.pop()
        });
    else if ("object" === typeof a) b.push(a), f += g(), b.pop();
    else if ("function" === typeof a) var h = b[b.length - 1],
        f = f + (a.call(h, g(), function (a) {
            return k(a, h)
        }) || "");
    else a && (f += g());
    return f
}

function g(b, g) {
    for (var g = g || {}, d = g.tags || a.tags, f = d[0], h = d[d.length - 1], k = ['var buffer = "";', "\nvar line = 1;", "\ntry {", '\nbuffer += "'], n = [], l = !1, j = !1, m = function () {
        if (l && !j && !g.space)
            for (; n.length;) k.splice(n.pop(), 1);
                else n = [];
            j = l = !1
        }, o = [], p, q, w, y = function (a) {
            d = x(a).split(/\s+/);
            q = d[0];
            w = d[d.length - 1]
        }, C = function (a) {
            k.push('";', p, '\nvar partial = partials["' + x(a) + '"];', "\nif (partial) {", "\n  buffer += render(partial,stack[stack.length - 1],partials);", "\n}", '\nbuffer += "')
        }, t = function (a, d) {
            var f =
            x(a);
            if ("" === f) throw c(Error("Section name may not be empty"), b, I, g.file);
            o.push({
                name: f,
                inverted: d
            });
            k.push('";', p, '\nvar name = "' + f + '";', "\nvar callback = (function () {", "\n  return function () {", '\n    var buffer = "";', '\nbuffer += "')
        }, J = function (a) {
            t(a, !0)
        }, D = function (a) {
            var a = x(a),
            d = 0 != o.length && o[o.length - 1].name;
            if (!d || a != d) throw c(Error('Section named "' + a + '" was never opened'), b, I, g.file);
            a = o.pop();
            k.push('";', "\n    return buffer;", "\n  };", "\n})();");
            a.inverted ? k.push("\nbuffer += renderSection(name,stack,callback,true);") :
            k.push("\nbuffer += renderSection(name,stack,callback);");
            k.push('\nbuffer += "')
        }, S = function (a) {
            k.push('";', p, '\nbuffer += lookup("' + x(a) + '",stack,"");', '\nbuffer += "')
        }, T = function (a) {
            k.push('";', p, '\nbuffer += escapeHTML(lookup("' + x(a) + '",stack,""));', '\nbuffer += "')
        }, I = 1, G, F, A = 0, X = b.length; A < X; ++A)
if (b.slice(A, A + f.length) === f) {
    A += f.length;
    G = b.substr(A, 1);
    p = "\nline = " + I + ";";
    q = f;
    w = h;
    l = !0;
    switch (G) {
        case "!":
        A++;
        F = null;
        break;
        case "=":
        A++;
        h = "=" + h;
        F = y;
        break;
        case ">":
        A++;
        F = C;
        break;
        case "#":
        A++;
        F = t;
        break;
        case "^":
        A++;
        F = J;
        break;
        case "/":
        A++;
        F = D;
        break;
        case "{":
        h = "}" + h;
        case "&":
        A++;
        j = !0;
        F = S;
        break;
        default:
        j = !0, F = T
    }
    G = b.indexOf(h, A);
    if (-1 === G) throw c(Error('Tag "' + f + '" was not closed properly'), b, I, g.file);
    f = b.substring(A, G);
    F && F(f);
    for (F = 0;~
        (F = f.indexOf("\n", F));) I++, F++;
        A = G + h.length - 1;
    f = q;
    h = w
} else switch (G = b.substr(A, 1), G) {
    case '"':
    case "\\":
    j = !0;
    k.push("\\" + G);
    break;
    case "\r":
    break;
    case "\n":
    n.push(k.length);
    k.push("\\n");
    m();
    I++;
    break;
    default:
    v.test(G) ? n.push(k.length) : j = !0, k.push(G)
}
if (0 != o.length) throw c(Error('Section "' +
    o[o.length - 1].name + '" was not closed properly'), b, I, g.file);
    m();
k.push('";', "\nreturn buffer;", "\n} catch (e) { throw {error: e, line: line}; }");
h = k.join("").replace(/buffer \+= "";\n/g, "");
g.debug && ("undefined" != typeof console && console.log ? console.log(h) : "function" === typeof print && print(h));
return h
}

function h(a, h) {
    var n = g(a, h),
    l = new Function("view,partials,stack,lookup,escapeHTML,renderSection,render", n);
    return function (g, n) {
        var n = n || {}, j = [g];
        try {
            return l(g, n, j, d, b, f, k)
        } catch (m) {
            throw c(m.error,
                a, m.line, h.file);
        }
    }
}

function n(a, b) {
    b = b || {};
    return !1 !== b.cache ? (y[a] || (y[a] = h(a, b)), y[a]) : h(a, b)
}

function k(a, b, g) {
    return n(a)(b, g)
}
a.name = "mustache.js";
a.version = "0.5.0-dev";
a.tags = ["{{", "}}"];
a.parse = g;
a.compile = n;
a.render = k;
a.clearCache = function () {
    y = {}
};
a.to_html = function (a, b, g, c) {
    a = k(a, b, g);
    if ("function" === typeof c) c(a);
    else return a
};
var l = Object.prototype.toString,
j = Array.isArray,
m = Array.prototype.forEach,
p = String.prototype.trim,
o;
o = j ? j : function (a) {
    return "[object Array]" === l.call(a)
};
var q;
q = m ? function (a, b, g) {
    return m.call(a, b, g)
} : function (a, b, g) {
    for (var c = 0, d = a.length; c < d; ++c) b.call(g, a[c], c, a)
};
var v = /^\s*$/,
x;
if (p) x = function (a) {
    return null == a ? "" : p.call(a)
};
else {
    var w, D;
    v.test("\u00a0") ? (w = /^\s+/, D = /\s+$/) : (w = /^[\s\xA0]+/, D = /[\s\xA0]+$/);
    x = function (a) {
        return a == null ? "" : ("" + a).replace(w, "").replace(D, "")
    }
}
var C = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}, y = {}
})(Mustache);
(function (a) {
    function b(b) {
        var g = b.data;
        b.isDefaultPrevented() || (b.preventDefault(), a(this).ajaxSubmit(g))
    }

    function c(b) {
        var g = b.target,
        c = a(g);
        if (!c.is(":submit,input:image")) {
            g = c.closest(":submit");
            if (0 == g.length) return;
            g = g[0]
        }
        var d = this;
        d.clk = g;
        "image" == g.type && (void 0 != b.offsetX ? (d.clk_x = b.offsetX, d.clk_y = b.offsetY) : "function" == typeof a.fn.offset ? (c = c.offset(), d.clk_x = b.pageX - c.left, d.clk_y = b.pageY - c.top) : (d.clk_x = b.pageX - g.offsetLeft, d.clk_y = b.pageY - g.offsetTop));
        setTimeout(function () {
            d.clk = d.clk_x =
            d.clk_y = null
        }, 100)
    }

    function d() {
        if (a.fn.ajaxSubmit.debug) {
            var b = "[jquery.form] " + Array.prototype.join.call(arguments, "");
            window.console && window.console.log ? window.console.log(b) : window.opera && window.opera.postError && window.opera.postError(b)
        }
    }
    a.fn.ajaxSubmit = function (b) {
        function g(g) {
            for (var c = new FormData, d = 0; d < g.length; d++) "file" != g[d].type && c.append(g[d].name, g[d].value);
                l.find("input:file:enabled").each(function () {
                    var b = a(this).attr("name"),
                    g = this.files;
                    if (b)
                        for (var d = 0; d < g.length; d++) c.append(b,
                            g[d])
                    });
            if (b.extraData)
                for (var h in b.extraData) c.append(h, b.extraData[h]);
                    b.data = null;
                g = a.extend(!0, {}, a.ajaxSettings, b, {
                    contentType: !1,
                    processData: !1,
                    cache: !1,
                    type: "POST"
                });
                g.data = null;
                var k = g.beforeSend;
                g.beforeSend = function (a, g) {
                    g.data = c;
                    a.upload && (a.upload.onprogress = function (a) {
                        g.progress(a.position, a.total)
                    });
                    k && k.call(g, a, b)
                };
                a.ajax(g)
            }

            function c(g) {
                function h() {
                    function b() {
                        try {
                            var a = (B.contentWindow ? B.contentWindow.document : B.contentDocument ? B.contentDocument : B.document).readyState;
                            d("state = " +
                                a);
                            "uninitialized" == a.toLowerCase() && setTimeout(b, 50)
                        } catch (g) {
                            d("Server abort: ", g, " (", g.name, ")"), k(P), L && clearTimeout(L), L = void 0
                        }
                    }
                    var g = l.attr("target"),
                    c = l.attr("action");
                    j.setAttribute("target", q);
                    n || j.setAttribute("method", "POST");
                    c != r.url && j.setAttribute("action", r.url);
                    !r.skipEncodingOverride && (!n || /post/i.test(n)) && l.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    });
                    r.timeout && (L = setTimeout(function () {
                        N = !0;
                        k(U)
                    }, r.timeout));
                    var f = [];
                    try {
                        if (r.extraData)
                            for (var m in r.extraData) f.push(a('<input type="hidden" name="' +
                                m + '">').attr("value", r.extraData[m]).appendTo(j)[0]);
                                r.iframeTarget || (H.appendTo("body"), B.attachEvent ? B.attachEvent("onload", k) : B.addEventListener("load", k, !1));
                            setTimeout(b, 15);
                            j.submit()
                        } finally {
                            j.setAttribute("action", c), g ? j.setAttribute("target", g) : l.removeAttr("target"), a(f).remove()
                        }
                    }

                    function k(b) {
                        if (!u.aborted && !V) {
                            try {
                                z = B.contentWindow ? B.contentWindow.document : B.contentDocument ? B.contentDocument : B.document
                            } catch (g) {
                                d("cannot access response document: ", g), b = P
                            }
                            if (b === U && u) u.abort("timeout");
                            else if (b == P && u) u.abort("server abort");
                            else if (z && z.location.href != r.iframeSrc || N) {
                                B.detachEvent ? B.detachEvent("onload", k) : B.removeEventListener("load", k, !1);
                                var b = "success",
                                c;
                                try {
                                    if (N) throw "timeout";
                                    var h = "xml" == r.dataType || z.XMLDocument || a.isXMLDoc(z);
                                    d("isXml=" + h);
                                    if (!h && (window.opera && (null == z.body || "" == z.body.innerHTML)) && --R) {
                                        d("requeing onLoad callback, DOM not available");
                                        setTimeout(k, 250);
                                        return
                                    }
                                    var f = z.body ? z.body : z.documentElement;
                                    u.responseText = f ? f.innerHTML : null;
                                    u.responseXML = z.XMLDocument ?
                                    z.XMLDocument : z;
                                    h && (r.dataType = "xml");
                                    u.getResponseHeader = function (a) {
                                        return {
                                            "content-type": r.dataType
                                        }[a]
                                    };
                                    f && (u.status = Number(f.getAttribute("status")) || u.status, u.statusText = f.getAttribute("statusText") || u.statusText);
                                    var n = (r.dataType || "").toLowerCase(),
                                    l = /(json|script|text)/.test(n);
                                    if (l || r.textarea) {
                                        var j = z.getElementsByTagName("textarea")[0];
                                        if (j) u.responseText = j.value, u.status = Number(j.getAttribute("status")) || u.status, u.statusText = j.getAttribute("statusText") || u.statusText;
                                        else if (l) {
                                            var m =
                                            z.getElementsByTagName("pre")[0],
                                            o = z.getElementsByTagName("body")[0];
                                            m ? u.responseText = m.textContent ? m.textContent : m.innerText : o && (u.responseText = o.textContent ? o.textContent : o.innerText)
                                        }
                                    } else "xml" == n && (!u.responseXML && null != u.responseText) && (u.responseXML = K(u.responseText));
                                    try {
                                        Q = t(u, n, r)
                                    } catch (q) {
                                        b = "parsererror", u.error = c = q || b
                                    }
                                } catch (ca) {
                                    d("error caught: ", ca), b = "error", u.error = c = ca || b
                                }
                                u.aborted && (d("upload aborted"), b = null);
                                u.status && (b = 200 <= u.status && 300 > u.status || 304 === u.status ? "success" : "error");
                                "success" === b ? (r.success && r.success.call(r.context, Q, "success", u), p && a.event.trigger("ajaxSuccess", [u, r])) : b && (void 0 == c && (c = u.statusText), r.error && r.error.call(r.context, u, b, c), p && a.event.trigger("ajaxError", [u, r, c]));
                                p && a.event.trigger("ajaxComplete", [u, r]);
                                p && !--a.active && a.event.trigger("ajaxStop");
                                r.complete && r.complete.call(r.context, u, b);
                                V = !0;
                                r.timeout && clearTimeout(L);
                                setTimeout(function () {
                                    r.iframeTarget || H.remove();
                                    u.responseXML = null
                                }, 100)
                            }
                        }
                    }
                    var j = l[0],
                    m, o, r, p, q, H, B, u, N, L;
                    m = !! a.fn.prop;
                    if (g)
                        if (m)
                            for (o =
                                0; o < g.length; o++) m = a(j[g[o].name]), m.prop("disabled", !1);
                                else
                                    for (o = 0; o < g.length; o++) m = a(j[g[o].name]), m.removeAttr("disabled");
                                        if (a(":input[name=submit],:input[id=submit]", j).length) alert('Error: Form elements must not have name or id of "submit".');
                                    else if (r = a.extend(!0, {}, a.ajaxSettings, b), r.context = r.context || r, q = "jqFormIO" + (new Date).getTime(), r.iframeTarget ? (H = a(r.iframeTarget), m = H.attr("name"), null == m ? H.attr("name", q) : q = m) : (H = a('<iframe name="' + q + '" src="' + r.iframeSrc + '" />'), H.css({
                                        position: "absolute",
                                        top: "-1000px",
                                        left: "-1000px"
                                    })), B = H[0], u = {
                                        aborted: 0,
                                        responseText: null,
                                        responseXML: null,
                                        status: 0,
                                        statusText: "n/a",
                                        getAllResponseHeaders: function () {},
                                        getResponseHeader: function () {},
                                        setRequestHeader: function () {},
                                        abort: function (b) {
                                            var g = b === "timeout" ? "timeout" : "aborted";
                                            d("aborting upload... " + g);
                                            this.aborted = 1;
                                            H.attr("src", r.iframeSrc);
                                            u.error = g;
                                            r.error && r.error.call(r.context, u, g, b);
                                            p && a.event.trigger("ajaxError", [u, r, g]);
                                            r.complete && r.complete.call(r.context, u, g)
                                        }
                                    }, (p = r.global) && !a.active++ && a.event.trigger("ajaxStart"),
                                    p && a.event.trigger("ajaxSend", [u, r]), r.beforeSend && !1 === r.beforeSend.call(r.context, u, r)) r.global && a.active--;
else if (!u.aborted) {
    if (g = j.clk)
        if ((m = g.name) && !g.disabled) r.extraData = r.extraData || {}, r.extraData[m] = g.value, "image" == g.type && (r.extraData[m + ".x"] = j.clk_x, r.extraData[m + ".y"] = j.clk_y);
    var U = 1,
    P = 2,
    g = a("meta[name=csrf-token]").attr("content");
    if ((m = a("meta[name=csrf-param]").attr("content")) && g) r.extraData = r.extraData || {}, r.extraData[m] = g;
    r.forceSync ? h() : setTimeout(h, 10);
    var Q, z, R = 50,
    V, K = a.parseXML ||
    function (a, b) {
        if (window.ActiveXObject) {
            b = new ActiveXObject("Microsoft.XMLDOM");
            b.async = "false";
            b.loadXML(a)
        } else b = (new DOMParser).parseFromString(a, "text/xml");
        return b && b.documentElement && b.documentElement.nodeName != "parsererror" ? b : null
    }, W = a.parseJSON || function (a) {
        return window.eval("(" + a + ")")
    }, t = function (b, g, c) {
        var d = b.getResponseHeader("content-type") || "",
        h = g === "xml" || !g && d.indexOf("xml") >= 0,
        b = h ? b.responseXML : b.responseText;
        h && b.documentElement.nodeName === "parsererror" && a.error && a.error("parsererror");
        c && c.dataFilter && (b = c.dataFilter(b, g));
        typeof b === "string" && (g === "json" || !g && d.indexOf("json") >= 0 ? b = W(b) : (g === "script" || !g && d.indexOf("javascript") >= 0) && a.globalEval(b));
        return b
    }
}
}
if (!this.length) return d("ajaxSubmit: skipping submit process - no element selected"), this;
var n, k, l = this;
"function" == typeof b && (b = {
    success: b
});
n = this.attr("method");
k = this.attr("action");
(k = (k = "string" === typeof k ? a.trim(k) : "") || window.location.href || "") && (k = (k.match(/^([^#]+)/) || [])[1]);
b = a.extend(!0, {
    url: k,
    success: a.ajaxSettings.success,
    type: n || "GET",
    iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
}, b);
k = {};
this.trigger("form-pre-serialize", [this, b, k]);
if (k.veto) return d("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
if (b.beforeSerialize && !1 === b.beforeSerialize(this, b)) return d("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
var j = b.traditional;
void 0 === j && (j = a.ajaxSettings.traditional);
var m, p = this.formToArray(b.semantic);
b.data && (b.extraData = b.data, m = a.param(b.data,
    j));
if (b.beforeSubmit && !1 === b.beforeSubmit(p, this, b)) return d("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
this.trigger("form-submit-validate", [p, this, b, k]);
if (k.veto) return d("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
k = a.param(p, j);
m && (k = k ? k + "&" + m : m);
"GET" == b.type.toUpperCase() ? (b.url += (0 <= b.url.indexOf("?") ? "&" : "?") + k, b.data = null) : b.data = k;
var o = [];
b.resetForm && o.push(function () {
    l.resetForm()
});
b.clearForm && o.push(function () {
    l.clearForm(b.includeHidden)
});
if (!b.dataType && b.target) {
    var q = b.success || function () {};
    o.push(function (g) {
        var c = b.replaceTarget ? "replaceWith" : "html";
        a(b.target)[c](g).each(q, arguments)
    })
} else b.success && o.push(b.success);
b.success = function (a, g, c) {
    for (var d = b.context || b, h = 0, k = o.length; h < k; h++) o[h].apply(d, [a, g, c || l, l])
};
j = a("input:file:enabled[value]", this);
m = 0 < j.length;
k = "multipart/form-data" == l.attr("enctype") || "multipart/form-data" == l.attr("encoding");
j = !(!m || !j.get(0).files || !window.FormData);
d("fileAPI :" + j);
!1 !== b.iframe &&
(b.iframe || (m || k) && !j) ? b.closeKeepAlive ? a.get(b.closeKeepAlive, function () {
    c(p)
}) : c(p) : (m || k) && j ? (b.progress = b.progress || a.noop, g(p)) : a.ajax(b);
this.trigger("form-submit-notify", [this, b]);
return this
};
a.fn.ajaxForm = function (f) {
    f = f || {};
    f.delegation = f.delegation && a.isFunction(a.fn.on);
    if (!f.delegation && 0 === this.length) {
        var g = this.selector,
        h = this.context;
        if (!a.isReady && g) return d("DOM not ready, queuing ajaxForm"), a(function () {
            a(g, h).ajaxForm(f)
        }), this;
            d("terminating; zero elements found by selector" +
                (a.isReady ? "" : " (DOM not ready)"));
            return this
        }
        return f.delegation ? (a(document).off("submit.form-plugin", this.selector, b).off("click.form-plugin", this.selector, c).on("submit.form-plugin", this.selector, f, b).on("click.form-plugin", this.selector, f, c), this) : this.ajaxFormUnbind().bind("submit.form-plugin", f, b).bind("click.form-plugin", f, c)
    };
    a.fn.ajaxFormUnbind = function () {
        return this.unbind("submit.form-plugin click.form-plugin")
    };
    a.fn.formToArray = function (b) {
        var g = [];
        if (0 === this.length) return g;
        var c =
        this[0],
        d = b ? c.getElementsByTagName("*") : c.elements;
        if (!d) return g;
        var k, l, j, m, p, o;
        k = 0;
        for (p = d.length; k < p; k++)
            if (l = d[k], j = l.name)
                if (b && c.clk && "image" == l.type)!l.disabled && c.clk == l && (g.push({
                    name: j,
                    value: a(l).val(),
                    type: l.type
                }), g.push({
                    name: j + ".x",
                    value: c.clk_x
                }, {
                    name: j + ".y",
                    value: c.clk_y
                }));
                    else if ((m = a.fieldValue(l, !0)) && m.constructor == Array) {
                        l = 0;
                        for (o = m.length; l < o; l++) g.push({
                            name: j,
                            value: m[l]
                        })
                    } else null !== m && "undefined" != typeof m && g.push({
                        name: j,
                        value: m,
                        type: l.type
                    }); if (!b && c.clk && (b = a(c.clk),
                        d = b[0], (j = d.name) && !d.disabled && "image" == d.type)) g.push({
                        name: j,
                        value: b.val()
                    }), g.push({
                        name: j + ".x",
                        value: c.clk_x
                    }, {
                        name: j + ".y",
                        value: c.clk_y
                    });
                    return g
                };
                a.fn.formSerialize = function (b) {
                    return a.param(this.formToArray(b))
                };
                a.fn.fieldSerialize = function (b) {
                    var g = [];
                    this.each(function () {
                        var c = this.name;
                        if (c) {
                            var d = a.fieldValue(this, b);
                            if (d && d.constructor == Array)
                                for (var k = 0, l = d.length; k < l; k++) g.push({
                                    name: c,
                                    value: d[k]
                                });
                                    else null !== d && "undefined" != typeof d && g.push({
                                        name: this.name,
                                        value: d
                                    })
                                }
                            });
                    return a.param(g)
                };
                a.fn.fieldValue = function (b) {
                    for (var g = [], c = 0, d = this.length; c < d; c++) {
                        var k = a.fieldValue(this[c], b);
                        null === k || ("undefined" == typeof k || k.constructor == Array && !k.length) || (k.constructor == Array ? a.merge(g, k) : g.push(k))
                    }
                    return g
                };
                a.fieldValue = function (b, g) {
                    var c = b.name,
                    d = b.type,
                    k = b.tagName.toLowerCase();
                    void 0 === g && (g = !0);
                    if (g && (!c || b.disabled || "reset" == d || "button" == d || ("checkbox" == d || "radio" == d) && !b.checked || ("submit" == d || "image" == d) && b.form && b.form.clk != b || "select" == k && -1 == b.selectedIndex)) return null;
                    if ("select" == k) {
                        var l = b.selectedIndex;
                        if (0 > l) return null;
                        for (var c = [], k = b.options, j = (d = "select-one" == d) ? l + 1 : k.length, l = d ? l : 0; l < j; l++) {
                            var m = k[l];
                            if (m.selected) {
                                var p = m.value;
                                p || (p = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value);
                                if (d) return p;
                                c.push(p)
                            }
                        }
                        return c
                    }
                    return a(b).val()
                };
                a.fn.clearForm = function (b) {
                    return this.each(function () {
                        a("input,select,textarea", this).clearFields(b)
                    })
                };
                a.fn.clearFields = a.fn.clearInputs = function (a) {
                    var b = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
                    return this.each(function () {
                        var c = this.type,
                        d = this.tagName.toLowerCase();
                        b.test(c) || "textarea" == d || a && /hidden/.test(c) ? this.value = "" : "checkbox" == c || "radio" == c ? this.checked = !1 : "select" == d && (this.selectedIndex = -1)
                    })
                };
                a.fn.resetForm = function () {
                    return this.each(function () {
                        ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset()
                    })
                };
                a.fn.enable = function (a) {
                    void 0 === a && (a = !0);
                    return this.each(function () {
                        this.disabled = !a
                    })
                };
                a.fn.selected = function (b) {
                    void 0 === b && (b = !0);
                    return this.each(function () {
                        var g = this.type;
                        "checkbox" == g || "radio" == g ? this.checked = b : "option" == this.tagName.toLowerCase() && (g = a(this).parent("select"), b && (g[0] && "select-one" == g[0].type) && g.find("option").selected(!1), this.selected = b)
                    })
                };
                a.fn.ajaxSubmit.debug = !1
            })(jQuery);
            (function (a) {
                a.extend(a.fn, {
                    validate: function (b) {
                        if (this.length) {
                            var c = a.data(this[0], "validator");
                            if (c) return c;
                            this.attr("novalidate", "novalidate");
                            c = new a.validator(b, this[0]);
                            a.data(this[0], "validator", c);
                            c.settings.onsubmit && (b = this.find("input, button"), b.filter(".cancel").click(function () {
                                c.cancelSubmit = !0
                            }), c.settings.submitHandler && b.filter(":submit").click(function () {
                                c.submitButton = this
                            }), this.submit(function (b) {
                                function f() {
                                    if (c.settings.submitHandler) {
                                        if (c.submitButton) var b = a("<input type='hidden'/>").attr("name",
                                            c.submitButton.name).val(c.submitButton.value).appendTo(c.currentForm);
                                            c.settings.submitHandler.call(c, c.currentForm);
                                        c.submitButton && b.remove();
                                        return !1
                                    }
                                    return !0
                                }
                                c.settings.debug && b.preventDefault();
                                if (c.cancelSubmit) return c.cancelSubmit = !1, f();
                                if (c.form()) return c.pendingRequest ? (c.formSubmitted = !0, !1) : f();
                                c.focusInvalid();
                                return !1
                            }));
return c
}
b && b.debug && window.console && console.warn("nothing selected, can't validate, returning nothing")
},
valid: function () {
    if (a(this[0]).is("form")) return this.validate().form();
    var b = !0,
    c = a(this[0].form).validate();
    this.each(function () {
        b &= c.element(this)
    });
    return b
},
removeAttrs: function (b) {
    var c = {}, d = this;
    a.each(b.split(/\s/), function (a, b) {
        c[b] = d.attr(b);
        d.removeAttr(b)
    });
    return c
},
rules: function (b, c) {
    var d = this[0];
    if (b) {
        var f = a.data(d.form, "validator").settings,
        g = f.rules,
        h = a.validator.staticRules(d);
        switch (b) {
            case "add":
            a.extend(h, a.validator.normalizeRule(c));
            g[d.name] = h;
            c.messages && (f.messages[d.name] = a.extend(f.messages[d.name], c.messages));
            break;
            case "remove":
            if (!c) return delete g[d.name],
                h;
            var n = {};
            a.each(c.split(/\s/), function (a, b) {
                n[b] = h[b];
                delete h[b]
            });
            return n
        }
    }
    d = a.validator.normalizeRules(a.extend({}, a.validator.metadataRules(d), a.validator.classRules(d), a.validator.attributeRules(d), a.validator.staticRules(d)), d);
    d.required && (f = d.required, delete d.required, d = a.extend({
        required: f
    }, d));
    return d
}
});
a.extend(a.expr[":"], {
    blank: function (b) {
        return !a.trim("" + b.value)
    },
    filled: function (b) {
        return !!a.trim("" + b.value)
    },
    unchecked: function (a) {
        return !a.checked
    }
});
a.validator = function (b, c) {
    this.settings =
    a.extend(!0, {}, a.validator.defaults, b);
    this.currentForm = c;
    this.init()
};
a.validator.format = function (b, c) {
    if (1 == arguments.length) return function () {
        var c = a.makeArray(arguments);
        c.unshift(b);
        return a.validator.format.apply(this, c)
    };
    2 < arguments.length && c.constructor != Array && (c = a.makeArray(arguments).slice(1));
    c.constructor != Array && (c = [c]);
    a.each(c, function (a, c) {
        b = b.replace(RegExp("\\{" + a + "\\}", "g"), c)
    });
    return b
};
a.extend(a.validator, {
    defaults: {
        messages: {},
        groups: {},
        rules: {},
        errorClass: "error",
        validClass: "valid",
        errorElement: "label",
        focusInvalid: !0,
        errorContainer: a([]),
        errorLabelContainer: a([]),
        onsubmit: !0,
        ignore: ":hidden",
        ignoreTitle: !1,
        onfocusin: function (a) {
            this.lastActive = a;
            this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.addWrapper(this.errorsFor(a)).hide())
        },
        onfocusout: function (a) {
            !this.checkable(a) && (a.name in this.submitted || !this.optional(a)) && this.element(a)
        },
        onkeyup: function (a) {
            (a.name in
                this.submitted || a == this.lastElement) && this.element(a)
        },
        onclick: function (a) {
            a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
        },
        highlight: function (b, c, d) {
            "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
        },
        unhighlight: function (b, c, d) {
            "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
        }
    },
    setDefaults: function (b) {
        a.extend(a.validator.defaults, b)
    },
    messages: {
        required: "This field is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        accept: "Please enter a value with a valid extension.",
        maxlength: a.validator.format("Please enter no more than {0} characters."),
        minlength: a.validator.format("Please enter at least {0} characters."),
        rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
        range: a.validator.format("Please enter a value between {0} and {1}."),
        max: a.validator.format("Please enter a value less than or equal to {0}."),
        min: a.validator.format("Please enter a value greater than or equal to {0}.")
    },
    autoCreateRanges: !1,
    prototype: {
        init: function () {
            function b(b) {
                var g = a.data(this[0].form, "validator"),
                c = "on" + b.type.replace(/^validate/, "");
                g.settings[c] && g.settings[c].call(g, this[0], b)
            }
            this.labelContainer =
            a(this.settings.errorLabelContainer);
            this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm);
            this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer);
            this.submitted = {};
            this.valueCache = {};
            this.pendingRequest = 0;
            this.pending = {};
            this.invalid = {};
            this.reset();
            var c = this.groups = {};
            a.each(this.settings.groups, function (b, g) {
                a.each(g.split(/\s/), function (a, g) {
                    c[g] = b
                })
            });
            var d = this.settings.rules;
            a.each(d, function (b, g) {
                d[b] = a.validator.normalizeRule(g)
            });
            a(this.currentForm).validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", b).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", b);
            this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate",
                this.settings.invalidHandler)
        },
        form: function () {
            this.checkForm();
            a.extend(this.submitted, this.errorMap);
            this.invalid = a.extend({}, this.errorMap);
            this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]);
            this.showErrors();
            return this.valid()
        },
        checkForm: function () {
            this.prepareForm();
            for (var a = 0, c = this.currentElements = this.elements(); c[a]; a++) this.check(c[a]);
                return this.valid()
        },
        element: function (b) {
            this.lastElement = b = this.validationTargetFor(this.clean(b));
            this.prepareElement(b);
            this.currentElements =
            a(b);
            var c = this.check(b);
            c ? delete this.invalid[b.name] : this.invalid[b.name] = !0;
            this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers));
            this.showErrors();
            return c
        },
        showErrors: function (b) {
            if (b) {
                a.extend(this.errorMap, b);
                this.errorList = [];
                for (var c in b) this.errorList.push({
                    message: b[c],
                    element: this.findByName(c)[0]
                });
                    this.successList = a.grep(this.successList, function (a) {
                        return !(a.name in b)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function () {
                a.fn.resetForm && a(this.currentForm).resetForm();
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass)
            },
            numberOfInvalids: function () {
                return this.objectLength(this.invalid)
            },
            objectLength: function (a) {
                var c = 0,
                d;
                for (d in a) c++;
                    return c
            },
            hideErrors: function () {
                this.addWrapper(this.toHide).hide()
            },
            valid: function () {
                return 0 == this.size()
            },
            size: function () {
                return this.errorList.length
            },
            focusInvalid: function () {
                if (this.settings.focusInvalid) try {
                    a(this.findLastActive() ||
                        this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                } catch (b) {}
            },
            findLastActive: function () {
                var b = this.lastActive;
                return b && 1 == a.grep(this.errorList, function (a) {
                    return a.element.name == b.name
                }).length && b
            },
            elements: function () {
                var b = this,
                c = {};
                return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
                    !this.name && b.settings.debug && window.console && console.error("%o has no name assigned",
                        this);
                    return this.name in c || !b.objectLength(a(this).rules()) ? !1 : c[this.name] = !0
                })
            },
            clean: function (b) {
                return a(b)[0]
            },
            errors: function () {
                return a(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext)
            },
            reset: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = a([]);
                this.toHide = a([]);
                this.currentElements = a([])
            },
            prepareForm: function () {
                this.reset();
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function (a) {
                this.reset();
                this.toHide = this.errorsFor(a)
            },
            check: function (b) {
                var b = this.validationTargetFor(this.clean(b)),
                c = a(b).rules(),
                d = !1,
                f;
                for (f in c) {
                    var g = {
                        method: f,
                        parameters: c[f]
                    };
                    try {
                        var h = a.validator.methods[f].call(this, b.value.replace(/\r/g, ""), b, g.parameters);
                        if ("dependency-mismatch" == h) d = !0;
                        else {
                            d = !1;
                            if ("pending" == h) {
                                this.toHide = this.toHide.not(this.errorsFor(b));
                                return
                            }
                            if (!h) return this.formatAndAdd(b, g), !1
                        }
                } catch (n) {
                    throw this.settings.debug && window.console && console.log("exception occured when checking element " + b.id + ", check the '" + g.method +
                        "' method", n), n;
                }
            }
            if (!d) return this.objectLength(c) && this.successList.push(b), !0
        },
    customMetaMessage: function (b, c) {
        if (a.metadata) {
            var d = this.settings.meta ? a(b).metadata()[this.settings.meta] : a(b).metadata();
            return d && d.messages && d.messages[c]
        }
    },
    customMessage: function (a, c) {
        var d = this.settings.messages[a];
        return d && (d.constructor == String ? d : d[c])
    },
    findDefined: function () {
        for (var a = 0; a < arguments.length; a++)
            if (void 0 !== arguments[a]) return arguments[a]
        },
    defaultMessage: function (b, c) {
        return this.findDefined(this.customMessage(b.name,
            c), this.customMetaMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
    },
    formatAndAdd: function (a, c) {
        var d = this.defaultMessage(a, c.method),
        f = /\$?\{(\d+)\}/g;
        "function" == typeof d ? d = d.call(this, c.parameters, a) : f.test(d) && (d = jQuery.format(d.replace(f, "{$1}"), c.parameters));
        this.errorList.push({
            message: d,
            element: a
        });
        this.errorMap[a.name] = d;
        this.submitted[a.name] = d
    },
    addWrapper: function (a) {
        this.settings.wrapper && (a =
            a.add(a.parent(this.settings.wrapper)));
        return a
    },
    defaultShowErrors: function () {
        for (var a = 0; this.errorList[a]; a++) {
            var c = this.errorList[a];
            this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass);
            this.showLabel(c.element, c.message)
        }
        this.errorList.length && (this.toShow = this.toShow.add(this.containers));
        if (this.settings.success)
            for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
                if (this.settings.unhighlight) {
                    a = 0;
                    for (c = this.validElements(); c[a]; a++) this.settings.unhighlight.call(this,
                        c[a], this.settings.errorClass, this.settings.validClass)
                }
            this.toHide = this.toHide.not(this.toShow);
            this.hideErrors();
            this.addWrapper(this.toShow).show()
        },
        validElements: function () {
            return this.currentElements.not(this.invalidElements())
        },
        invalidElements: function () {
            return a(this.errorList).map(function () {
                return this.element
            })
        },
        showLabel: function (b, c) {
            var d = this.errorsFor(b);
            d.length ? (d.removeClass(this.settings.validClass).addClass(this.settings.errorClass), d.attr("generated") && d.html(c)) : (d = a("<" + this.settings.errorElement +
                "/>").attr({
                    "for": this.idOrName(b),
                    generated: !0
                }).addClass(this.settings.errorClass).html(c || ""), this.settings.wrapper && (d = d.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.append(d).length || (this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b)));
            !c && this.settings.success && (d.text(""), "string" == typeof this.settings.success ? d.addClass(this.settings.success) : this.settings.success(d));
            this.toShow = this.toShow.add(d)
        },
        errorsFor: function (b) {
            var c =
            this.idOrName(b);
            return this.errors().filter(function () {
                return a(this).attr("for") == c
            })
        },
        idOrName: function (a) {
            return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
        },
        validationTargetFor: function (a) {
            this.checkable(a) && (a = this.findByName(a.name).not(this.settings.ignore)[0]);
            return a
        },
        checkable: function (a) {
            return /radio|checkbox/i.test(a.type)
        },
        findByName: function (b) {
            var c = this.currentForm;
            return a(document.getElementsByName(b)).map(function (a, f) {
                return f.form == c && f.name == b && f || null
            })
        },
        getLength: function (b, c) {
            switch (c.nodeName.toLowerCase()) {
                case "select":
                return a("option:selected", c).length;
                case "input":
                if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length
            }
        return b.length
    },
    depend: function (a, c) {
        return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, c) : !0
    },
    dependTypes: {
        "boolean": function (a) {
            return a
        },
        string: function (b, c) {
            return !!a(b, c.form).length
        },
        "function": function (a, c) {
            return a(c)
        }
    },
    optional: function (b) {
        return !a.validator.methods.required.call(this,
            a.trim(b.value), b) && "dependency-mismatch"
    },
    startRequest: function (a) {
        this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0)
    },
    stopRequest: function (b, c) {
        this.pendingRequest--;
        0 > this.pendingRequest && (this.pendingRequest = 0);
        delete this.pending[b.name];
        c && 0 == this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && (0 == this.pendingRequest && this.formSubmitted) && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
    },
    previousValue: function (b) {
        return a.data(b, "previousValue") || a.data(b, "previousValue", {
            old: null,
            valid: !0,
            message: this.defaultMessage(b, "remote")
        })
    }
},
classRuleSettings: {
    required: {
        required: !0
    },
    email: {
        email: !0
    },
    url: {
        url: !0
    },
    date: {
        date: !0
    },
    dateISO: {
        dateISO: !0
    },
    dateDE: {
        dateDE: !0
    },
    number: {
        number: !0
    },
    numberDE: {
        numberDE: !0
    },
    digits: {
        digits: !0
    },
    creditcard: {
        creditcard: !0
    }
},
addClassRules: function (b, c) {
    b.constructor == String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
},
classRules: function (b) {
    var c = {};
    (b = a(b).attr("class")) && a.each(b.split(" "), function () {
        this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
    });
    return c
},
attributeRules: function (b) {
    var c = {}, b = a(b),
    d;
    for (d in a.validator.methods) {
        var f;
        (f = "required" === d && "function" === typeof a.fn.prop ? b.prop(d) : b.attr(d)) ? c[d] = f : b[0].getAttribute("type") === d && (c[d] = !0)
    }
    c.maxlength && /-1|2147483647|524288/.test(c.maxlength) && delete c.maxlength;
    return c
},
metadataRules: function (b) {
    if (!a.metadata) return {};
    var c = a.data(b.form,
        "validator").settings.meta;
    return c ? a(b).metadata()[c] : a(b).metadata()
},
staticRules: function (b) {
    var c = {}, d = a.data(b.form, "validator");
    d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {});
    return c
},
normalizeRules: function (b, c) {
    a.each(b, function (d, f) {
        if (!1 === f) delete b[d];
        else if (f.param || f.depends) {
            var g = !0;
            switch (typeof f.depends) {
                case "string":
                g = !! a(f.depends, c.form).length;
                break;
                case "function":
                g = f.depends.call(c, c)
            }
            g ? b[d] = void 0 !== f.param ? f.param : !0 : delete b[d]
        }
    });
    a.each(b,
        function (d, f) {
            b[d] = a.isFunction(f) ? f(c) : f
        });
    a.each(["minlength", "maxlength", "min", "max"], function () {
        b[this] && (b[this] = Number(b[this]))
    });
    a.each(["rangelength", "range"], function () {
        b[this] && (b[this] = [Number(b[this][0]), Number(b[this][1])])
    });
    if (a.validator.autoCreateRanges && (b.min && b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), b.minlength && b.maxlength)) b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength;
    b.messages && delete b.messages;
    return b
},
normalizeRule: function (b) {
    if ("string" ==
        typeof b) {
        var c = {};
    a.each(b.split(/\s/), function () {
        c[this] = !0
    });
    b = c
}
return b
},
addMethod: function (b, c, d) {
    a.validator.methods[b] = c;
    a.validator.messages[b] = void 0 != d ? d : a.validator.messages[b];
    3 > c.length && a.validator.addClassRules(b, a.validator.normalizeRule(b))
},
methods: {
    required: function (b, c, d) {
        if (!this.depend(d, c)) return "dependency-mismatch";
        switch (c.nodeName.toLowerCase()) {
            case "select":
            return (b = a(c).val()) && 0 < b.length;
            case "input":
            if (this.checkable(c)) return 0 < this.getLength(b, c);
            default:
            return 0 <
            a.trim(b).length
        }
    },
    remote: function (b, c, d) {
        if (this.optional(c)) return "dependency-mismatch";
        var f = this.previousValue(c);
        this.settings.messages[c.name] || (this.settings.messages[c.name] = {});
        f.originalMessage = this.settings.messages[c.name].remote;
        this.settings.messages[c.name].remote = f.message;
        d = "string" == typeof d && {
            url: d
        } || d;
        if (this.pending[c.name]) return "pending";
        if (f.old === b) return f.valid;
        f.old = b;
        var g = this;
        this.startRequest(c);
        var h = {};
        h[c.name] = b;
        a.ajax(a.extend(!0, {
            url: d,
            mode: "abort",
            port: "validate" +
            c.name,
            dataType: "json",
            data: h,
            success: function (d) {
                g.settings.messages[c.name].remote = f.originalMessage;
                var h = d === true;
                if (h) {
                    var l = g.formSubmitted;
                    g.prepareElement(c);
                    g.formSubmitted = l;
                    g.successList.push(c);
                    g.showErrors()
                } else {
                    l = {};
                    d = d || g.defaultMessage(c, "remote");
                    l[c.name] = f.message = a.isFunction(d) ? d(b) : d;
                    g.showErrors(l)
                }
                f.valid = h;
                g.stopRequest(c, h)
            }
        }, d));
        return "pending"
    },
    minlength: function (b, c, d) {
        return this.optional(c) || this.getLength(a.trim(b), c) >= d
    },
    maxlength: function (b, c, d) {
        return this.optional(c) ||
        this.getLength(a.trim(b), c) <= d
    },
    rangelength: function (b, c, d) {
        b = this.getLength(a.trim(b), c);
        return this.optional(c) || b >= d[0] && b <= d[1]
    },
    min: function (a, c, d) {
        return this.optional(c) || a >= d
    },
    max: function (a, c, d) {
        return this.optional(c) || a <= d
    },
    range: function (a, c, d) {
        return this.optional(c) || a >= d[0] && a <= d[1]
    },
    email: function (a, c) {
        return this.optional(c) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a)
    },
    url: function (a, c) {
        return this.optional(c) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
    },
    date: function (a, c) {
        return this.optional(c) || !/Invalid|NaN/.test(new Date(a))
    },
    dateISO: function (a, c) {
        return this.optional(c) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)
    },
    number: function (a, c) {
        return this.optional(c) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)
    },
    digits: function (a, c) {
        return this.optional(c) || /^\d+$/.test(a)
    },
    creditcard: function (a, c) {
        if (this.optional(c)) return "dependency-mismatch";
        if (/[^0-9 -]+/.test(a)) return !1;
        for (var d = 0, f = 0, g = !1, a = a.replace(/\D/g, ""), h = a.length - 1; 0 <= h; h--) {
            f =
            a.charAt(h);
            f = parseInt(f, 10);
            if (g && 9 < (f *= 2)) f -= 9;
            d += f;
            g = !g
        }
        return 0 == d % 10
    },
    accept: function (a, c, d) {
        d = "string" == typeof d ? d.replace(/,/g, "|") : "png|jpe?g|gif";
        return this.optional(c) || a.match(RegExp(".(" + d + ")$", "i"))
    },
    equalTo: function (b, c, d) {
        d = a(d).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
            a(c).valid()
        });
        return b == d.val()
    }
}
});
a.format = a.validator.format
})(jQuery);
(function (a) {
    var b = {};
    if (a.ajaxPrefilter) a.ajaxPrefilter(function (a, c, g) {
        c = a.port;
        "abort" == a.mode && (b[c] && b[c].abort(), b[c] = g)
    });
        else {
            var c = a.ajax;
            a.ajax = function (d) {
                var f = ("port" in d ? d : a.ajaxSettings).port;
                return "abort" == ("mode" in d ? d : a.ajaxSettings).mode ? (b[f] && b[f].abort(), b[f] = c.apply(this, arguments)) : c.apply(this, arguments)
            }
        }
    })(jQuery);
    (function (a) {
        !jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener && a.each({
            focus: "focusin",
            blur: "focusout"
        }, function (b, c) {
            function d(b) {
                b = a.event.fix(b);
                b.type = c;
                return a.event.handle.call(this, b)
            }
            a.event.special[c] = {
                setup: function () {
                    this.addEventListener(b, d, !0)
                },
                teardown: function () {
                    this.removeEventListener(b, d, !0)
                },
                handler: function (b) {
                    arguments[0] = a.event.fix(b);
                    arguments[0].type = c;
                    return a.event.handle.apply(this, arguments)
                }
            }
        });
        a.extend(a.fn, {
            validateDelegate: function (b,
                c, d) {
                return this.bind(c, function (c) {
                    var g = a(c.target);
                    if (g.is(b)) return d.apply(g, arguments)
                })
            }
        })
    })(jQuery);
    eval(function (a, b, c, d, f) {
        for (f = function (a) {
            return (a < b ? "" : f(parseInt(a / b))) + (35 < (a %= b) ? String.fromCharCode(a + 29) : a.toString(36))
        }; c--;) d[c] && (a = a.replace(RegExp("\\b" + f(c) + "\\b", "g"), d[c]));
            return a
        }('(m($){1k W=2v.4N,D=2v.4M,F=2v.4L,u=2v.4K;m V(){C $("<4J/>")};$.N=m(T,c){1k O=$(T),2E,A=V(),1i=V(),I=V().r(V()).r(V()).r(V()),B=V().r(V()).r(V()).r(V()),E=$([]),1J,G,l,17={v:0,l:0},Q,M,1j,1f={v:0,l:0},12=0,1I="1G",2k,2j,1s,1r,S,1A,1z,2o,2n,14,1O,a,b,j,g,f={a:0,b:0,j:0,g:0,H:0,L:0},2u=R.4I,$p,d,i,o,w,h,2p;m 1m(x){C x+17.v-1f.v};m 1l(y){C y+17.l-1f.l};m 1a(x){C x-17.v+1f.v};m 19(y){C y-17.l+1f.l};m 1y(3H){C 3H.4H-1f.v};m 1x(3G){C 3G.4G-1f.l};m 13(30){1k 1h=30||1s,1g=30||1r;C{a:u(f.a*1h),b:u(f.b*1g),j:u(f.j*1h),g:u(f.g*1g),H:u(f.j*1h)-u(f.a*1h),L:u(f.g*1g)-u(f.b*1g)}};m 23(a,b,j,g,2Z){1k 1h=2Z||1s,1g=2Z||1r;f={a:u(a/1h||0),b:u(b/1g||0),j:u(j/1h||0),g:u(g/1g||0)};f.H=f.j-f.a;f.L=f.g-f.b};m 1e(){9(!O.H()){C}17={v:u(O.2t().v),l:u(O.2t().l)};Q=O.2X();M=O.3F();17.l+=(O.2Y()-M)>>1;17.v+=(O.2q()-Q)>>1;1A=u(c.4F/1s)||0;1z=u(c.4E/1r)||0;2o=u(F(c.4D/1s||1<<24,Q));2n=u(F(c.4C/1r||1<<24,M));9($().4B=="1.3.2"&&1I=="21"&&!2u["4A"]){17.l+=D(R.1p.2r,2u.2r);17.v+=D(R.1p.2s,2u.2s)}1f=/1G|4z/.1V(1j.q("1o"))?{v:u(1j.2t().v)-1j.2s(),l:u(1j.2t().l)-1j.2r()}:1I=="21"?{v:$(R).2s(),l:$(R).2r()}:{v:0,l:0};G=1m(0);l=1l(0);9(f.j>Q||f.g>M){1S()}};m 1T(3D){9(!1O){C}A.q({v:1m(f.a),l:1l(f.b)}).r(1i).H(w=f.H).L(h=f.L);1i.r(I).r(E).q({v:0,l:0});I.H(D(w-I.2q()+I.2X(),0)).L(D(h-I.2Y()+I.3F(),0));$(B[0]).q({v:G,l:l,H:f.a,L:M});$(B[1]).q({v:G+f.a,l:l,H:w,L:f.b});$(B[2]).q({v:G+f.j,l:l,H:Q-f.j,L:M});$(B[3]).q({v:G+f.a,l:l+f.g,H:w,L:M-f.g});w-=E.2q();h-=E.2Y();2N(E.3b){15 8:$(E[4]).q({v:w>>1});$(E[5]).q({v:w,l:h>>1});$(E[6]).q({v:w>>1,l:h});$(E[7]).q({l:h>>1});15 4:E.3E(1,3).q({v:w});E.3E(2,4).q({l:h})}9(3D!==Y){9($.N.1Z!=2Q){$(R).U($.N.1Z,$.N.3C)}9(c.1R){$(R)[$.N.1Z]($.N.3C=2Q)}}9($.1b.1E&&I.2q()-I.2X()==2){I.q("3B",0);3u(m(){I.q("3B","4y")},0)}};m 22(3A){1e();1T(3A);a=1m(f.a);b=1l(f.b);j=1m(f.j);g=1l(f.g)};m 27(2W,2w){c.1N?2W.4x(c.1N,2w):2W.1q()};m 1c(2V){1k x=1a(1y(2V))-f.a,y=19(1x(2V))-f.b;9(!2p){1e();2p=11;A.1F("4w",m(){2p=Y})}S="";9(c.2C){9(y<=c.1U){S="n"}X{9(y>=f.L-c.1U){S="s"}}9(x<=c.1U){S+="w"}X{9(x>=f.H-c.1U){S+="e"}}}A.q("2U",S?S+"-18":c.26?"4v":"");9(1J){1J.4u()}};m 2R(4t){$("1p").q("2U","");9(c.4s||f.H*f.L==0){27(A.r(B),m(){$(J).1q()})}$(R).U("P",2l);A.P(1c);c.2f(T,13())};m 2B(1W){9(1W.3w!=1){C Y}1e();9(S){$("1p").q("2U",S+"-18");a=1m(f[/w/.1V(S)?"j":"a"]);b=1l(f[/n/.1V(S)?"g":"b"]);$(R).P(2l).1F("1w",2R);A.U("P",1c)}X{9(c.26){2k=G+f.a-1y(1W);2j=l+f.b-1x(1W);A.U("P",1c);$(R).P(2S).1F("1w",m(){c.2f(T,13());$(R).U("P",2S);A.P(1c)})}X{O.1M(1W)}}C Y};m 1v(3z){9(14){9(3z){j=D(G,F(G+Q,a+W(g-b)*14*(j>a||-1)));g=u(D(l,F(l+M,b+W(j-a)/14*(g>b||-1))));j=u(j)}X{g=D(l,F(l+M,b+W(j-a)/14*(g>b||-1)));j=u(D(G,F(G+Q,a+W(g-b)*14*(j>a||-1))));g=u(g)}}};m 1S(){a=F(a,G+Q);b=F(b,l+M);9(W(j-a)<1A){j=a-1A*(j<a||-1);9(j<G){a=G+1A}X{9(j>G+Q){a=G+Q-1A}}}9(W(g-b)<1z){g=b-1z*(g<b||-1);9(g<l){b=l+1z}X{9(g>l+M){b=l+M-1z}}}j=D(G,F(j,G+Q));g=D(l,F(g,l+M));1v(W(j-a)<W(g-b)*14);9(W(j-a)>2o){j=a-2o*(j<a||-1);1v()}9(W(g-b)>2n){g=b-2n*(g<b||-1);1v(11)}f={a:1a(F(a,j)),j:1a(D(a,j)),b:19(F(b,g)),g:19(D(b,g)),H:W(j-a),L:W(g-b)};1T();c.2g(T,13())};m 2l(2T){j=/w|e|^$/.1V(S)||14?1y(2T):1m(f.j);g=/n|s|^$/.1V(S)||14?1x(2T):1l(f.g);1S();C Y};m 1u(3y,3x){j=(a=3y)+f.H;g=(b=3x)+f.L;$.2c(f,{a:1a(a),b:19(b),j:1a(j),g:19(g)});1T();c.2g(T,13())};m 2S(2m){a=D(G,F(2k+1y(2m),G+Q-f.H));b=D(l,F(2j+1x(2m),l+M-f.L));1u(a,b);2m.4r();C Y};m 2h(){$(R).U("P",2h);1e();j=a;g=b;1S();S="";9(!B.2y(":4q")){A.r(B).1q().2D(c.1N||0)}1O=11;$(R).U("1w",1L).P(2l).1F("1w",2R);A.U("P",1c);c.3v(T,13())};m 1L(){$(R).U("P",2h).U("1w",1L);27(A.r(B));23(1a(a),19(b),1a(a),19(b));9(!J 4p $.N){c.2g(T,13());c.2f(T,13())}};m 2z(2i){9(2i.3w!=1||B.2y(":4o")){C Y}1e();2k=a=1y(2i);2j=b=1x(2i);$(R).P(2h).1w(1L);C Y};m 2A(){22(Y)};m 2x(){2E=11;25(c=$.2c({1Q:"4n",26:11,20:"1p",2C:11,1U:10,3t:m(){},3v:m(){},2g:m(){},2f:m(){}},c));A.r(B).q({36:""});9(c.2F){1O=11;1e();1T();A.r(B).1q().2D(c.1N||0)}3u(m(){c.3t(T,13())},0)};1k 2Q=m(16){1k k=c.1R,d,t,2M=16.4m;d=!1K(k.2O)&&(16.2e||16.3q.2e)?k.2O:!1K(k.2a)&&16.3r?k.2a:!1K(k.2b)&&16.3s?k.2b:!1K(k.2P)?k.2P:10;9(k.2P=="18"||(k.2b=="18"&&16.3s)||(k.2a=="18"&&16.3r)||(k.2O=="18"&&(16.2e||16.3q.2e))){2N(2M){15 37:d=-d;15 39:t=D(a,j);a=F(a,j);j=D(t+d,a);1v();1t;15 38:d=-d;15 40:t=D(b,g);b=F(b,g);g=D(t+d,b);1v(11);1t;3p:C}1S()}X{a=F(a,j);b=F(b,g);2N(2M){15 37:1u(D(a-d,G),b);1t;15 38:1u(a,D(b-d,l));1t;15 39:1u(a+F(d,Q-1a(j)),b);1t;15 40:1u(a,b+F(d,M-19(g)));1t;3p:C}}C Y};m 1P(3o,2L){3m(2d 4l 2L){9(c[2d]!==1X){3o.q(2L[2d],c[2d])}}};m 25(K){9(K.20){(1j=$(K.20)).3g(A.r(B))}$.2c(c,K);1e();9(K.2K!=3n){E.1n();E=$([]);i=K.2K?K.2K=="4k"?4:8:0;3c(i--){E=E.r(V())}E.29(c.1Q+"-4j").q({1o:"1G",34:0,1H:12+1||1});9(!4i(E.q("H"))>=0){E.H(5).L(5)}9(o=c.2J){E.q({2J:o,2G:"3j"})}1P(E,{3k:"2I-28",3i:"2H-28",3l:"1d"})}1s=c.4h/Q||1;1r=c.4g/M||1;9(K.a!=3n){23(K.a,K.b,K.j,K.g);K.2F=!K.1q}9(K.1R){c.1R=$.2c({2b:1,2a:"18"},K.1R)}B.29(c.1Q+"-4f");1i.29(c.1Q+"-4e");3m(i=0;i++<4;){$(I[i-1]).29(c.1Q+"-2I"+i)}1P(1i,{4d:"2H-28",4c:"1d"});1P(I,{3l:"1d",2J:"2I-H"});1P(B,{4b:"2H-28",4a:"1d"});9(o=c.3k){$(I[0]).q({2G:"3j",3h:o})}9(o=c.3i){$(I[1]).q({2G:"49",3h:o})}A.3g(1i.r(I).r(1J).r(E));9($.1b.1E){9(o=B.q("3f").3e(/1d=(\\d+)/)){B.q("1d",o[1]/1Y)}9(o=I.q("3f").3e(/1d=(\\d+)/)){I.q("1d",o[1]/1Y)}}9(K.1q){27(A.r(B))}X{9(K.2F&&2E){1O=11;A.r(B).2D(c.1N||0);22()}}14=(d=(c.48||"").47(/:/))[0]/d[1];O.r(B).U("1M",2z);9(c.1D||c.1C===Y){A.U("P",1c).U("1M",2B);$(3d).U("18",2A)}X{9(c.1C||c.1D===Y){9(c.2C||c.26){A.P(1c).1M(2B)}$(3d).18(2A)}9(!c.46){O.r(B).1M(2z)}}c.1C=c.1D=1X};J.1n=m(){25({1D:11});A.r(B).1n()};J.45=m(){C c};J.31=25;J.44=13;J.43=23;J.42=1L;J.41=22;$p=O;3c($p.3b){12=D(12,!1K($p.q("z-3a"))?$p.q("z-3a"):12);9($p.q("1o")=="21"){1I="21"}$p=$p.20(":3Z(1p)")}12=c.1H||12;9($.1b.1E){O.3Y("3X","3W")}$.N.1Z=$.1b.1E||$.1b.3V?"3U":"3T";9($.1b.3S){1J=V().q({H:"1Y%",L:"1Y%",1o:"1G",1H:12+2||2})}A.r(B).q({36:"35",1o:1I,3R:"35",1H:12||"0"});A.q({1H:12+2||2});1i.r(I).q({1o:"1G",34:0});T.33||T.3Q=="33"||!O.2y("3P")?2x():O.1F("3O",2x);9($.1b.1E&&$.1b.3N>=7){T.32=T.32}};$.2w.N=m(Z){Z=Z||{};J.3M(m(){9($(J).1B("N")){9(Z.1n){$(J).1B("N").1n();$(J).3L("N")}X{$(J).1B("N").31(Z)}}X{9(!Z.1n){9(Z.1C===1X&&Z.1D===1X){Z.1C=11}$(J).1B("N",3K $.N(J,Z))}}});9(Z.3J){C $(J).1B("N")}C J}})(3I);',
            62, 298, "         if x1 y1 _7   _23 y2   x2  top function    css add   _4 left     _a _d return _2 _e _3 _10 width _c this _53 height _13 imgAreaSelect _8 mousemove _12 document _1c _6 unbind _5 _1 else false _54  true _16 _2c _21 case _4f _11 resize _29 _28 browser _39 opacity _30 _15 sy sx _b _14 var _27 _26 remove position body hide _1b _1a break _44 _41 mouseup evY evX _1e _1d data enable disable msie one absolute zIndex _17 _f isNaN _49 mousedown fadeSpeed _22 _50 classPrefix keys _31 _32 resizeMargin test _3f undefined 100 keyPress parent fixed _35 _2e  _4e movable _37 color addClass ctrl shift extend option altKey onSelectEnd onSelectChange _48 _4b _19 _18 _3d _47 _20 _1f _25 outerWidth scrollTop scrollLeft offset _24 Math fn _4d is _4a _4c _3e resizable fadeIn _9 show borderStyle background border borderWidth handles _52 key switch alt arrows _34 _3b _40 _43 cursor _3a _38 innerWidth outerHeight _2f _2d setOptions src complete fontSize hidden visibility    index length while window match filter append borderColor borderColor2 solid borderColor1 borderOpacity for null _51 default originalEvent ctrlKey shiftKey onInit setTimeout onSelectStart which _46 _45 _42 _36 margin onKeyPress _33 slice innerHeight _2b _2a jQuery instance new removeData each version load img readyState overflow opera keypress keydown safari on unselectable attr not  update cancelSelection setSelection getSelection getOptions persistent split aspectRatio dashed outerOpacity outerColor selectionOpacity selectionColor selection outer imageHeight imageWidth parseInt handle corners in keyCode imgareaselect animated instanceof visible preventDefault autoHide _3c toggle move mouseout fadeOut auto relative getBoundingClientRect jquery maxHeight maxWidth minHeight minWidth pageY pageX documentElement div round min max abs".split(" ")));

function isUndefined(a) {
    return "undefined" == typeof a ? !0 : !1
}

function in_array(a, b) {
    if ("string" == typeof a || "number" == typeof a)
        for (var c in b)
            if (b[c] == a) return !0;
        return !1
    }

    function trim(a) {
        return (a + "").replace(/(\s+)$/g, "").replace(/^\s+/g, "")
    }

    function stripos(a, b, c) {
        isUndefined(c) && (c = 0);
        a = a.toLowerCase().indexOf(b.toLowerCase(), c);
        return -1 == a ? !1 : a
    }

    function strlen(a) {
        return BROWSER.ie && -1 != a.indexOf("\n") ? a.replace(/\r?\n/g, "_").length : a.length
    }

    function mb_strlen(a) {
        for (var b = 0, c = 0; c < a.length; c++) b += 0 > a.charCodeAt(c) || 255 < a.charCodeAt(c) ? "utf-8" == charset ? 3 : 2 : 1;
            return b
    }

    function mb_cutstr(a, b, c) {
        for (var d = 0, f = "", c = !c ? "..." : c, b = b - c.length, g = 0; g < a.length; g++) {
            d += 0 > a.charCodeAt(g) || 255 < a.charCodeAt(g) ? "utf-8" == charset ? 3 : 2 : 1;
            if (d > b) {
                f += c;
                break
            }
            f += a.substr(g, 1)
        }
        return f
    }

    function preg_replace(a, b, c, d) {
        for (var d = !d ? "ig" : d, f = a.length, g = 0; g < f; g++) re = RegExp(a[g], d), c = c.replace(re, "string" == typeof b ? b : b[g] ? b[g] : b[0]);
            return c
    }

    function htmlspecialchars(a) {
        return preg_replace(["&", "<", ">", '"'], ["&amp;", "&lt;", "&gt;", "&quot;"], a)
    }

    function _attachEvent(a, b, c, d) {
        d = !d ? a : d;
        a.addEventListener ? a.addEventListener(b, c, !1) : d.attachEvent && a.attachEvent("on" + b, c)
    }

    function _detachEvent(a, b, c, d) {
        d = !d ? a : d;
        a.removeEventListener ? a.removeEventListener(b, c, !1) : d.detachEvent && a.detachEvent("on" + b, c)
    }

    function doane(a, b, c) {
        b = isUndefined(b) ? 1 : b;
        c = isUndefined(c) ? 1 : c;
        (e = a ? a : window.event) || (e = getEvent());
        if (!e) return null;
        b && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
        c && (e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0);
        return e
    }

    function isEmail(a) {
        return 6 < a.length && /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/.test(a)
    }

    function squarestrip(a) {
        a = a.replace("[", "%5B");
        return a = a.replace("]", "%5D")
    }

    function setcookie(a, b, c, d, f, g) {
        var h = new Date;
        if ("" == b || 0 > c) b = "", c = -2592E3;
        h.setTime(h.getTime() + 1E3 * c);
        f = !f ? cookiedomain : f;
        d = !d ? cookiepath : d;
        document.cookie = escape(cookiepre + a) + "=" + escape(b) + (h ? "; expires=" + h.toGMTString() : "") + (d ? "; path=" + d : "/") + (f ? "; domain=" + f : "") + (g ? "; secure" : "")
    }

    function getcookie(a, b) {
        var a = cookiepre + a,
        c = document.cookie.indexOf(a),
        d = document.cookie.indexOf(";", c);
        if (-1 == c) return "";
        c = document.cookie.substring(c + a.length + 1, d > c ? d : document.cookie.length);
        return !b ? unescape(c) : c
    }

    function TWinOpen(a, b, c, d) {
        TWin = window.showModalDialog(a, null, "dialogWidth=" + c + "px;dialogHeight=" + d + "px;dialogTop=" + (screen.height - 30 - d) / 2 + "px;dialogLeft=" + (screen.width - 10 - c) / 2 + "px")
    }

    function iFrameHeight(a) {
        var b = $(a),
        a = document.frames ? document.frames[a].document : b.contentDocument;
        null != b && null != a && (b.height = a.body.scrollHeight)
    }

    function random(a) {
        for (var b = "", c, d = 1; d <= a; d++) c = parseInt(35 * Math.random()), b += "ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz".charAt(c);
            return b
    }

    function mb_cutstr(a, b, c) {
        for (var d = 0, f = "", c = "", b = b - c.length, g = 0; g < a.length; g++) {
            d++;
            127 < a.charCodeAt(g) && d++;
            if (d > b) {
                f += c;
                break
            }
            f += a.substr(g, 1)
        }
        return f
    }

    function strLenCalc(a, b, c) {
        var d = a.value,
        f = str_length(d);
        c >= f ? $("#" + b).html(c - f) : a.value = mb_cutstr(d, c, 0)
    }

    function getTip(a) {
        var b = $("#data-tips").attr("data-" + a);
        return null != b && void 0 != b && "" !== b ? b : a
    }

    function check_message(a, b, c, d) {
        var f = $("#data-actions");
        $.ajax({
            type: "get",
            url: f.attr("data-ajax-message"),
            dataType: "json",
            data: {
                event: a,
                radom: random(3)
            }
        }).error(function () {
    //    show_message("error", getTip("error") + " check_message: " + getTip("server-error"), !1, 0)
}).success(function (a) {
    if (!0 === a.success) {
        var h = a.data,
        f = a.message;
        if ("tip" == f)
            for (a = 0; a < h.length; a++) {
                var k = h[a];
                setTimeout(function () {
                    show_message(f, k, b, c)
                }, d)
                    //edit by porter at 2013-11-28 14:14:20 添加三目运算符加active操作
                    // edit by porter at 2013-12-20 10:39:07添加消息条目
                } else "user_message" == f ? ($("#message_num_container").parent().attr('title',h.message_html),h.message_count!=0?$('#msg_num').html('('+h.message_count+')'):'',h.message_html!=''?$("#message_num_container").parent().addClass("active"):$("#message_num_container").parent().removeClass("active"), setTimeout(function () {
                    check_message("user_message", !1, 0, 0)
                }, 3E5)) : "alert" == f && ($("#alert_num_container").html(h.message_html), setTimeout(function () {
                    check_message("alert", !1, 0, 0)
                }, 25E4))
            } else show_message(a.message)
        })
}

function show_message(a, b, c, d) {
    var f = $.oDialog("messageDialog", {
        id: "ui_message_dialog",
        width: "100",
        center: !0,
        mask: !1,
        close: !c,
        className: "ui-message",
        tpl: '<div id="%ID" class="%CLASSNAME"><button type="button" class="close">\u00d7</button><div class="bd"><div class="ui-loading">loading...</div></div></div>'
    }),
    g = 8 * str_length(b) + 30,
    g = 500 < g ? 500 : g;
    f.width(170 > g ? 170 : g).body(b);
    f.elem.attr("class", "ui-message message-" + a);
    f.show();
    c && setTimeout(function () {
        f.hide()
    }, d)
}

function show_loading(a) {
    var b = $.oDialog("uloadingDialog", {
        id: "ui_loading_dialog",
        width: "250",
        center: !0,
        mask: !1,
        close: !1,
        className: "ui-message",
        tpl: '<div id="%ID" class="%CLASSNAME"><button type="button" class="close">\u00d7</button><div class="bd progress progress-striped active"><div class="bar" style="width:20%;"></div></div></div>'
    });
    b.width(280);
    b.elem.attr("class", "ui-message progress-" + a);
    b.elem.find(".bar").css("width", "50%");
    b.show()
}

function hide_loading() {
    var a = $.oFDialog("uloadingDialog");
    a && (setTimeout(function () {
        a.elem.find(".bar").css("width", "100%")
    }, 500), setTimeout(function () {
        a.hide();
        a.elem.find(".bar").css("width", "20%")
    }, 1E3))
}

function ajaxpost(a, b, c, d) {
    $.ajax({
        type: "post",
        url: a,
        dataType: "json",
        data: b
    }).error(function () {
        show_message("error", getTip("error") + " ajaxpost: " + a, !1, 0)
    }).success(function (a) {
        !0 === a.success ? c.call(b, a) : d.call(b, a)
    })
}

/**
*ajaxget请求
*@param url url
*@param data data
*@param succb 成功后回调函数
*@param errcb 失败后回调函数
*/
function ajaxget(url, data, succb, errcb) {
    $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        data: data
    }).error(function () {
      //  show_message("error", getTip("error") + " ajaxpost: " + url, !1, 0)
  }).success(function (result) {
    !0 === result.success ? succb.call(data, result) : errcb.call(data, result)
})
}

function fetchAjaxTpl(a, b) {
    var c = $("#data-actions");
    $.ajax({
        type: "post",
        url: c.attr("data-fetchtpl-url"),
        dataType: "json",
        data: {
            tpl: a
        }
    }).error(function () {
        // show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
    }).success(function (c) {
        !0 === c.success ? (wrapTpl(c.data.tpl, a + "_tpl"), null != b && b.call()) : show_message("error", getTip("error") + ": " + c.message, !1, 0)
    })
}

function showDialog(a, b) {
    null == document.getElementById(a + "_tpl") ? fetchAjaxTpl(a, function () {
        showTpl(a);
        null != b && b.call()
    }) : (showTpl(a), null != b && b.call())
}

function getStaticDialog() {
    var a = $.oDialog("puzzDialog", {
        id: "ui_puzz_dialog"
    });
    $(a).bind("hide", function () {
        // !isUndefined(crop_image) && null != crop_image && crop_image.remove();
        $(".tooltip").remove()
    });
    $(a).bind("show", function () {
        // !isUndefined(crop_image) && null != crop_image && crop_image.remove();
        $(".tooltip").remove()
    });
    return a
}

function showTpl(a) {
    var b = $("#" + a + "_tpl"),
    a = $(b.html()).find("div.pbody"),
    b = $(b.html()).find("div.footer"),
    c = a.attr("data-width"),
    d = a.attr("data-title"),
    f = a.attr("data-css-class");
    a = getStaticDialog().width(c).head(d).body(a);
    null != b.val() && a.footer(b.html());
    a.elem.addClass(f);    
    
    a.show();
    a.elem.css({opacity: "1"});
}

function getTpl(a, b) {
    null == document.getElementById(a + "_tpl") ? fetchAjaxTpl(a, function () {
        null != b && b.call()
    }) : null != b && b.call()
}

function wrapTpl(a, b) {
    $("#body").append('<script type="text/template" id="' + b + '">' + a + "<\/script>")
}

function openLoginDialog(a) {
    showDialog("login_box", function () {
        $.oValidate("login_form");
        null != a && !isUndefined(a) && a.call()
    })
}

function showSuccess(a, b) {
    show_message("success", getTip(a), !0, 3E3);
    null != b && (!0 == b ? window.location.reload() : window.location.href = b)
}

function showError(a) {
    "not-login" == $.trim(a) ? openLoginDialog() : null != a ? show_message("error", getTip($.trim(a)), !0, 3E3) :'' //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
}

function str_length(a) {
    for (var b = a.length, c = 0; c < a.length; c++) 127 < a.charCodeAt(c) && b++;
        return b
}
var imageReady = function () {
    var a = [],
    b = null,
    c = [
    ["width", "height"],
    ["naturalWidth", "naturalHeight"]
    ],
    d = Number("number" === typeof document.createElement("img").naturalHeight),
    f = function () {
        for (var c = 0; c < a.length; c++) a[c].end ? a.splice(c--, 1) : g.call(a[c], null);
            a.length && (b = setTimeout(f, 50)) || (b = null)
    }, g = function () {
        if (this[c[d][0]] !== this.__width || this[c[d][1]] !== this.__height || 1024 < this[c[d][0]] * this[c[d][1]]) this.onready.call(this, null), this.end = !0
    };
return function (h, n, k, l, j) {
    var n = n || "",
    k = k || new Function(n),
    l = l || new Function(n),
    j = j || new Function(n),
    m = "string" == typeof h ? new Image : h;
    m.onerror = function () {
        j.call(m, n);
        m.end = !0;
        m = m.onload = m.onerror = m.onreadystatechange = null
    };
    "string" == typeof h && (m.src = h);
    m && (m.__width = m[c[d][0]], m.__height = m[c[d][1]], m.complete ? (k.call(m, n), l.call(m, n)) : (m.onready = function () {
        k.call(m, n)
    }, g.call(m, null), m.onload = m.onreadystatechange = function () {
        if (!m || !m.readyState || !(m.readyState != "loaded" && m.readyState != "complete")) {
            !m.end && g.call(m, null);
            l.call(m, n);
            m = m.onload = m.onerror =
            m.onreadystatechange = null
        }
    }, m.end || (a.push(m), null === b && (b = setTimeout(f, 50)))))
}
}();

function preloadImages(a, b, c, d, f) {
    var f = f || new Function,
    b = b || new Function,
    d = d || new Function,
    c = c || new Function,
    g = a.length;
    0 === g && f.call(a, null);
    for (var h = 0; h < g; h++) imageReady(a[h], function () {
        b.call(this, null);
        h == g && f.call(a, null)
    }, function () {
        c.call(this, null)
    }, function () {
        d.call(this, null);
        h == g && f.call(a, null)
    })
}
$.fn.extend({
    insertAtCaret: function (a, b) {
        return this.each(function () {
            if (document.selection) this.focus(), sel = document.selection.createRange(), sel.text = a, b && (sel.moveStart("character", -(a.length - 1)), sel.moveEnd("character", -1), sel.select());
            else if (this.selectionStart || "0" == this.selectionStart) {
                var c = this.selectionStart,
                d = this.selectionEnd,
                f = this.scrollTop;
                this.value = this.value.substring(0, c) + a + this.value.substring(d, this.value.length);
                this.focus();
                b ? (this.selectionStart = c + 1, this.selectionEnd = c + a.length -
                    1) : (this.selectionStart = c + a.length, this.selectionEnd = c + a.length);
                this.scrollTop = f
            } else this.value += a, this.focus()
        })
    }
});

function utf8_encode(a) {
    if (null === a || "undefined" === typeof a) return "";
    var a = a + "",
    b = "",
    c, d, f = 0;
    c = d = 0;
    for (var f = a.length, g = 0; g < f; g++) {
        var h = a.charCodeAt(g),
        n = null;
        128 > h ? d++ : n = 127 < h && 2048 > h ? String.fromCharCode(h >> 6 | 192) + String.fromCharCode(h & 63 | 128) : String.fromCharCode(h >> 12 | 224) + String.fromCharCode(h >> 6 & 63 | 128) + String.fromCharCode(h & 63 | 128);
        null !== n && (d > c && (b += a.slice(c, d)), b += n, c = d = g + 1)
    }
    d > c && (b += a.slice(c, f));
    return b
}

function serialize(a) {
    var b = function (a) {
        for (var b = 0, c = 0, g = a.length, d = "", c = 0; c < g; c++) d = a.charCodeAt(c), b = 128 > d ? b + 1 : 2048 > d ? b + 2 : b + 3;
            return b
    }, c = function (a) {
        var b = typeof a,
        c, g;
        if ("object" === b && !a) return "null";
        if ("object" === b) {
            if (!a.constructor) return "object";
            a = a.constructor.toString();
            (c = a.match(/(\w+)\(/)) && (a = c[1].toLowerCase());
                c = ["boolean", "number", "string", "array"];
                for (g in c)
                    if (a == c[g]) {
                        b = c[g];
                        break
                    }
                }
                return b
            }, d = c(a),
            f = "";
            switch (d) {
                case "function":
                b = "";
                break;
                case "boolean":
                b = "b:" + (a ? "1" : "0");
                break;
                case "number":
                b = (Math.round(a) == a ? "i" : "d") + ":" + a;
                break;
                case "string":
                b = "s:" + b(a) + ':"' + a + '"';
                break;
                case "array":
                case "object":
                var b = "a",
                g = 0,
                h = "",
                n;
                for (n in a) a.hasOwnProperty(n) && (f = c(a[n]), "function" !== f && (f = n.match(/^[0-9]+$/) ? parseInt(n, 10) : n, h += this.serialize(f) + this.serialize(a[n]), g++));
                    b += ":" + g + ":{" + h + "}";
                break;
                default:
                b = "N"
            }
            "object" !== d && "array" !== d && (b += ";");
            return b
        };

        function parseurl(a, b) {
            a = a.replace(/([^>=\]"'\/@]|^)((((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k|thunder|qqdl|synacast):\/\/))([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&;~`@':+!#]*)*)/ig, "html" == b ? '$1<a href="$2" target="_blank">$2</a>' : "$1[url]$2[/url]");
            a = a.replace(/([^\w>=\]"'\/@]|^)((www\.)([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&;~`@':+!#]*)*)/ig,
                "html" == b ? '$1<a href="$2" target="_blank">$2</a>' : "$1[url]$2[/url]");
            return a = a.replace(/([^\w->=\]:"'\.\/]|^)(([\-\.\w]+@[\.\-\w]+(\.\w+)+))/ig, "html" == b ? '$1<a href="mailto:$2">$2</a>' : "$1[email]$2[/email]")
        }

        function addslashes(a) {
            return preg_replace("\\\\ \\' \\/ \\( \\) \\[ \\] \\{ \\} \\^ \\$ \\? \\. \\* \\+ \\|".split(" "), "\\\\ \\' \\/ \\( \\) \\[ \\] \\{ \\} \\^ \\$ \\? \\. \\* \\+ \\|".split(" "), a)
        }

        function bbcode2html(a) {
            if ("" == a) return "";
            "undefined" == typeof parsetype && (parsetype = 0);
            a = a.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(jpg|gif|png|bmp))/ig, "$1[img]$2[/img]");
            a = clearcode(a);
            a = a.replace(/\[url\]\s*((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.)([^\[\"']+?)\s*\[\/url\]/ig, function (a, c, d, f) {
                return cuturl(c +
                    f)
            });
            a = a.replace(/\[url=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\r\n\[\"']+?)\]([\s\S]+?)\[\/url\]/ig, '<a href="$1$3" target="_blank">$4</a>');
            a = a.replace(/\[email\](.*?)\[\/email\]/ig, '<a href="mailto:$1">$1</a>');
            a = a.replace(/\[email=(.[^\[]*)\](.*?)\[\/email\]/ig, '<a href="mailto:$1" target="_blank">$2</a>');
            a = a.replace(/\[color=([^\[\<]+?)\]/ig, '<font color="$1">');
            a = a.replace(/\[backcolor=([^\[\<]+?)\]/ig, '<font style="background-color:$1">');
            a = a.replace(/\[size=(\d+?)\]/ig, '<font size="$1">');
            a = a.replace(/\[size=(\d+(\.\d+)?(px|pt)+?)\]/ig, '<font style="font-size: $1">');
            a = a.replace(/\[font=([^\[\<]+?)\]/ig, '<font face="$1">');
            a = a.replace(/\[align=([^\[\<]+?)\]/ig, '<div align="$1">');
            a = a.replace(/\[p=(\d{1,2}|null), (\d{1,2}|null), (left|center|right)\]/ig, '<p style="line-height: $1px; text-indent: $2em; text-align: $3;">');
            a = a.replace(/\[float=left\]/ig, '<br style="clear: both"><span style="float: left; margin-right: 5px;">');
            a = a.replace(/\[float=right\]/ig,
                '<br style="clear: both"><span style="float: right; margin-left: 5px;">');
            1 != parsetype && (a = a.replace(/\[quote]([\s\S]*?)\[\/quote\]\s?\s?/ig, '<div class="quote"><blockquote>$1</blockquote></div>\n'));
            re = /\[table(?:=(\d{1,4}%?)(?:,([\(\)%,#\w ]+))?)?\]\s*([\s\S]+?)\s*\[\/table\]/ig;
            for (i = 0; 4 > i; i++) a = a.replace(re, function (a, c, d, f) {
                return parsetable(c, d, f)
            });
                a = preg_replace("\\[\\/color\\] \\[\\/backcolor\\] \\[\\/size\\] \\[\\/font\\] \\[\\/align\\] \\[\\/p\\] \\[b\\] \\[\\/b\\] \\[i\\] \\[\\/i\\] \\[u\\] \\[\\/u\\] \\[s\\] \\[\\/s\\] \\[hr\\] \\[list\\] \\[list=1\\] \\[list=a\\] \\[list=A\\] \\s?\\[\\*\\] \\[\\/list\\] \\[indent\\] \\[\\/indent\\] \\[\\/float\\]".split(" "),
                    '</font>;</font>;</font>;</font>;</div>;</p>;<b>;</b>;<i>;</i>;<u>;</u>;<strike>;</strike>;<hr class="l" />;<ul>;<ul type=1 class="litype_1">;<ul type=a class="litype_2">;<ul type=A class="litype_3">;<li>;</ul>;<blockquote>;</blockquote>;</span>'.split(";"), a, "g");
                a = a.replace(/\[img\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ig, '<a href="$1" target="_blank">$1</a>');
                a = a.replace(/\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ig, '<a href="$1" target="_blank">$1</a>');
                return a = a.replace(/<script[^\>]*?>([^\x00]*?)<\/script>/ig,
                    "")
            }

            function clearcode(a) {
                a = a.replace(/\[url\]\[\/url\]/ig, "", a);
                a = a.replace(/\[url=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\s\[\"']+?)\]\[\/url\]/ig, "", a);
                a = a.replace(/\[email\]\[\/email\]/ig, "", a);
                a = a.replace(/\[email=(.[^\[]*)\]\[\/email\]/ig, "", a);
                a = a.replace(/\[color=([^\[\<]+?)\]\[\/color\]/ig, "", a);
                a = a.replace(/\[size=(\d+?)\]\[\/size\]/ig, "", a);
                a = a.replace(/\[size=(\d+(\.\d+)?(px|pt)+?)\]\[\/size\]/ig, "", a);
                a = a.replace(/\[font=([^\[\<]+?)\]\[\/font\]/ig, "",
                    a);
                a = a.replace(/\[align=([^\[\<]+?)\]\[\/align\]/ig, "", a);
                a = a.replace(/\[p=(\d{1,2}), (\d{1,2}), (left|center|right)\]\[\/p\]/ig, "", a);
                a = a.replace(/\[float=([^\[\<]+?)\]\[\/float\]/ig, "", a);
                a = a.replace(/\[quote\]\[\/quote\]/ig, "", a);
                a = a.replace(/\[code\]\[\/code\]/ig, "", a);
                a = a.replace(/\[table\]\[\/table\]/ig, "", a);
                a = a.replace(/\[free\]\[\/free\]/ig, "", a);
                a = a.replace(/\[b\]\[\/b]/ig, "", a);
                a = a.replace(/\[u\]\[\/u]/ig, "", a);
                a = a.replace(/\[i\]\[\/i]/ig, "", a);
                return a = a.replace(/\[s\]\[\/s]/ig, "", a)
            }

            function cuturl(a) {
                var b = '<a href="' + ("www." == a.toLowerCase().substr(0, 4) ? "http://" + a : a) + '" target="_blank">';
                65 < a.length && (a = a.substr(0, 32) + " ... " + a.substr(a.length - 19));
                return b + (a + "</a>")
            }

            function dstag(a, b, c) {
                if ("" == trim(b)) return "\n";
                var d = parsestyle(a, "", ""),
                f = d.prepend,
                d = d.append;
                in_array(c, ["div", "p"]) && (align = getoptionvalue("align", a), in_array(align, ["left", "center", "right"]) ? (f = "[align=" + align + "]" + f, d += "[/align]") : d += "\n");
                return f + recursion(c, b, "dstag") + d
            }

            function ptag(a, b) {
                if ("" == trim(b)) return "\n";
                if ("" == trim(a)) return b + "\n";
                var c = null,
                d = null,
                f;
                f = /line-height\s?:\s?(\d{1,3})px/i;
                f = f.exec(a);
                null != f && (c = f[1]);
                f = /text-indent\s?:\s?(\d{1,3})em/i;
                f = f.exec(a);
                null != f && (d = f[1]);
                f = /text-align\s?:\s?(left|center|right)/i;
                f = f.exec(a);
                f = null != f ? f[1] : getoptionvalue("align", a);
                f = in_array(f, ["left", "center", "right"]) ? f : "left";
                style = getoptionvalue("style", a);
                style = preg_replace(["line-height\\s?:\\s?(\\d{1,3})px", "text-indent\\s?:\\s?(\\d{1,3})em", "text-align\\s?:\\s?(left|center|right)"],
                    "", style);
                return null === c && null === d ? "[align=" + f + "]" + (style ? '<span style="' + style + '">' : "") + b + (style ? "</span>" : "") + "[/align]" : "[p=" + c + ", " + d + ", " + f + "]" + (style ? '<span style="' + style + '">' : "") + b + (style ? "</span>" : "") + "[/p]"
            }

            function fetchoptionvalue(a, b) {
                return !1 !== (position = strpos(b, a)) ? (delimiter = position + a.length, delimchar = '"' == b.charAt(delimiter) ? '"' : "'" == b.charAt(delimiter) ? "'" : " ", delimloc = strpos(b, delimchar, delimiter + 1), !1 === delimloc ? delimloc = b.length : ('"' == delimchar || "'" == delimchar) && delimiter++, trim(b.substr(delimiter, delimloc - delimiter))) : ""
            }

            function fonttag(a, b) {
                var c = "",
                d = "",
                f = [],
                f = {
                    font: "face=",
                    size: "size=",
                    color: "color="
                };
                for (bbcode in f)
                    if (optionvalue = fetchoptionvalue(f[bbcode], a)) c += "[" + bbcode + "=" + optionvalue + "]", d = "[/" + bbcode + "]" + d;
                c = parsestyle(a, c, d);
                return c.prepend + recursion("font", b, "fonttag") + c.append
            }

            function getoptionvalue(a, b) {
                re = RegExp(a + "(s+?)?=(s+?)?[\"']?(.+?)([\"']|$|>)", "ig");
                var c = re.exec(b);
                return null != c ? trim(c[3]) : ""
            }

            function html2bbcode(a) {
                if ("" == trim(a)) return a = a.replace(/<img[^>]+smilieid=(["']?)(\d+)(\1)[^>]*>/ig, function (a, c, d) {
                    return smileycode(d)
                }), a = a.replace(/<img([^>]*aid=[^>]*)>/ig, function (a, c) {
                    return imgtag(c)
                });
                a = preg_replace('<style.*?>[\\s\\S]*?</style>;<script.*?>[\\s\\S]*?<\/script>;<noscript.*?>[\\s\\S]*?</noscript>;<select.*?>[sS]*?</select>;<object.*?>[sS]*?</object>;<\!--[\\s\\S]*?--\>; on[a-zA-Z]{3,16}\\s?=\\s?"[\\s\\S]*?"'.split(";"), "", a);
                a = a.replace(/(\r\n|\n|\r)/ig, "");
                a = a.replace(/&((#(32|127|160|173))|shy|nbsp);/ig,
                    " ");
                a = a.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(jpg|gif|png|bmp))/ig, "$1[img]$2[/img]");
                a = a.replace(/<br\s+?style=(["']?)clear: both;?(\1)[^\>]*>/ig, "");
                a = a.replace(/<br[^\>]*>/ig, "\n");
                a = preg_replace("<table[^>]*float:\\s*(left|right)[^>]*><tbody><tr><td>\\s*([\\s\\S]+?)\\s*</td></tr></tbody></table> <table([^>]*(width|background|background-color|backcolor)[^>]*)> <table[^>]*> <tr[^>]*(?:background|background-color|backcolor)[:=]\\s*([\"']?)([()\\s%,#\\w]+)(\\1)[^>]*> <tr[^>]*> (<t[dh]([^>]*(left|center|right)[^>]*)>)\\s*([\\s\\S]+?)\\s*(</t[dh]>) <t[dh]([^>]*(width|colspan|rowspan)[^>]*)> <t[dh][^>]*> </t[dh]> </tr> </table> <h\\d[^>]*> </h\\d>".split(" "), [
                    function (a, c, d) {
                        return "[float=" + c + "]" + d + "[/float]"
                    },
                    function (a, c) {
                        return tabletag(c)
                    }, "[table]\n",
                    function (a, c, d) {
                        return "[tr=" + d + "]"
                    }, "[tr]",
                    function (a, c, d, f, g, h) {
                        return c + "[align=" + f + "]" + g + "[/align]" + h
                    },
                    function (a, c) {
                        return tdtag(c)
                    }, "[td]", "[/td]", "[/tr]\n", "[/table]", "[b]", "[/b]"
                    ], a);
a = a.replace(/<h([0-9]+)[^>]*>(.*)<\/h\\1>/ig, "[size=$1]$2[/size]\n\n");
a = a.replace(/<hr[^>]*>/ig, "[hr]");
a = a.replace(/<img[^>]+smilieid=(["']?)(\d+)(\1)[^>]*>/ig, function (a, c, d) {
    return smileycode(d)
});
a = a.replace(/<img([^>]*src[^>]*)>/ig,
    function (a, c) {
        return imgtag(c)
    });
a = a.replace(/<a\s+?name=(["']?)(.+?)(\1)[\s\S]*?>([\s\S]*?)<\/a>/ig, "$4");
a = recursion("b", a, "simpletag", "b");
a = recursion("strong", a, "simpletag", "b");
a = recursion("i", a, "simpletag", "i");
a = recursion("em", a, "simpletag", "i");
a = recursion("u", a, "simpletag", "u");
a = recursion("strike", a, "simpletag", "s");
a = recursion("a", a, "atag");
a = recursion("font", a, "fonttag");
a = recursion("blockquote", a, "simpletag", "indent");
a = recursion("ol", a, "listtag");
a = recursion("ul", a, "listtag");
a = recursion("div",
    a, "dstag");
a = recursion("p", a, "ptag");
a = recursion("span", a, "fonttag");
a = a.replace(/<[\/\!]*?[^<>]*?>/ig, "");
a = clearcode(a);
return preg_replace(["&nbsp;", "&lt;", "&gt;", "&amp;"], [" ", "<", ">", "&"], a)
}

function atag(a, b) {
    if ("" == trim(b)) return "";
    var c = parsestyle(a, "", "");
    href = getoptionvalue("href", a);
    return "javascript:" == href.substr(0, 11) ? trim(recursion("a", b, "atag")) : c.prepend + "[url=" + href + "]" + trim(recursion("a", b, "atag")) + "[/url]" + c.append
}

function tablesimple(a, b, c) {
    return strpos(c, "[tr=") || strpos(c, "[td=") ? a : "[table=" + b + "]\n" + preg_replace("\\[tr\\] \\[\\/td\\]\\s?\\[td\\] \\[\\/tr\\]s? \\[td\\] \\[\\/td\\] \\[\\/td\\]\\[\\/tr\\]".split(" "), " |     ".split(" "), c) + "[/table]"
}

function imgtag(a) {
    var b = "",
    c = "";
    re = /src=(["']?)([\s\S]*?)(\1)/i;
    var d = re.exec(a);
    if (null != d) var f = d[2];
    else return "";
    re = /(max-)?width\s?:\s?(\d{1,4})(px)?/i;
    d = re.exec(a);
    null != d && !d[1] && (b = d[2]);
    re = /height\s?:\s?(\d{1,4})(px)?/i;
    d = re.exec(a);
    null != d && (c = d[1]);
    b || (re = /width=(["']?)(\d+)(\1)/i, d = re.exec(a), null != d && (b = d[2]));
    c || (re = /height=(["']?)(\d+)(\1)/i, d = re.exec(a), null != d && (c = d[2]));
    b = 0 < b ? b : 0;
    c = 0 < c ? c : 0;
    return 0 < b || 0 < c ? "[img=" + b + "," + c + "]" + f + "[/img]" : "[img]" + f + "[/img]"
}

function listtag(a, b, c) {
    var b = b.replace(/<li>(([\s\S](?!<\/li))*?)(?=<\/?ol|<\/?ul|<li|\[list|\[\/list)/ig, "<li>$1</li>") + (BROWSER.opera ? "</li>" : ""),
    b = recursion("li", b, "litag"),
    d = "[list]",
    a = fetchoptionvalue("type=", a),
    a = "" != a ? a : "ol" == c ? "1" : "";
    in_array(a, ["1", "a", "A"]) && (d = "[list=" + a + "]");
    return b ? d + "\n" + recursion(c, b, "listtag") + "[/list]" : ""
}

function litag(a, b) {
    return "[*]" + b.replace(/(\s+)$/g, "") + "\n"
}

function parsestyle(a, b, c) {
    var d = [
    ["align", !0, "text-align:\\s*(left|center|right);?", 1],
    ["float", !0, "float:\\s*(left|right);?", 1],
    ["color", !0, "(^|[;\\s])color:\\s*([^;]+);?", 2],
    ["backcolor", !0, "(^|[;\\s])background-color:\\s*([^;]+);?", 2],
    ["font", !0, "font-family:\\s*([^;]+);?", 1],
    ["size", !0, "font-size:\\s*(\\d+(\\.\\d+)?(px|pt|in|cm|mm|pc|em|ex|%|));?", 1],
    ["size", !0, "font-size:\\s*(x\\-small|small|medium|large|x\\-large|xx\\-large|\\-webkit\\-xxx\\-large);?", 1, "size"],
    ["b", !1, "font-weight:\\s*(bold);?"],
    ["i", !1, "font-style:\\s*(italic);?"],
    ["u", !1, "text-decoration:\\s*(underline);?"],
    ["s", !1, "text-decoration:\\s*(line-through);?"]
    ],
    f = {
        "x-small": 1,
        small: 2,
        medium: 3,
        large: 4,
        "x-large": 5,
        "xx-large": 6,
        "-webkit-xxx-large": 7
    }, a = getoptionvalue("style", a);
    re = /^(?:\s|)color:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)(;?)/i;
    for (var a = a.replace(re, function (a, b, c, g, d) {
        return "color:#" + parseInt(b).toString(16) + parseInt(c).toString(16) + parseInt(g).toString(16) + d
    }), g = d.length, h = 0; h < g; h++) d[h][4] = !d[h][4] ? "" : d[h][4], re = RegExp(d[h][2],
        "ig"), match = re.exec(a), null != match && (opnvalue = match[d[h][3]], "size" == d[h][4] && (opnvalue = f[opnvalue]), b += "[" + d[h][0] + (!0 == d[h][1] ? "=" + opnvalue + "]" : "]"), c = "[/" + d[h][0] + "]" + c);
    return {
        prepend: b,
        append: c
    }
}

function parsetable(a, b, c) {
    if (isUndefined(a)) a = "";
    else try {
        a = "%" == a.substr(a.length - 1, a.length) ? 98 >= a.substr(0, a.length - 1) ? a : "98%" : 560 >= a ? a : "98%"
    } catch (d) {
        a = ""
    }
    if (!isUndefined(c)) {
        if (!1 === strpos(c, "[/tr]") && !1 === strpos(c, "[/td]")) {
            var c = c.split("\n"),
            f = "";
            for (i = 0; i < c.length; i++) f += "<tr><td>" + preg_replace(["\r", "\\\\\\|", "\\|", "\\\\n"], ["", "&#124;", "</td><td>", "\n"], c[i]) + "</td></tr>";
                c = f;
            simple = " simpletable"
        } else simple = "", c = c.replace(/\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td(?:=(\d{1,4}%?))?\]/ig, function (a,
            b, c) {
            return "<tr" + (b ? ' style="background-color: ' + b + '"' : "") + "><td" + (c ? ' width="' + c + '"' : "") + ">"
        }), c = c.replace(/\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/ig, function (a, b, c, d, f) {
            return "<tr" + (b ? ' style="background-color: ' + b + '"' : "") + "><td" + (c ? ' colspan="' + c + '"' : "") + (d ? ' rowspan="' + d + '"' : "") + (f ? ' width="' + f + '"' : "") + ">"
        }), c = c.replace(/\[\/td\]\s*\[td(?:=(\d{1,4}%?))?\]/ig, function (a, b) {
            return "</td><td" + (b ? ' width="' + b + '"' : "") + ">"
        }), c = c.replace(/\[\/td\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/ig,
        function (a, b, c, d) {
            return "</td><td" + (b ? ' colspan="' + b + '"' : "") + (c ? ' rowspan="' + c + '"' : "") + (d ? ' width="' + d + '"' : "") + ">"
        }), c = c.replace(/\[\/td\]\s*\[\/tr\]\s*/ig, "</td></tr>"), c = c.replace(/<td> <\/td>/ig, "<td>&nbsp;</td>");
        return "<table " + ("" == a ? "" : 'width="' + a + '" ') + 'class="t_table"' + (isUndefined(b) ? "" : ' style="background-color: ' + b + '"') + simple + ">" + c + "</table>"
    }
}

function preg_quote(a) {
    return (a + "").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, "\\$1")
}

function recursion(a, b, c, d) {
    null == d && (d = "");
    var a = a.toLowerCase(),
    f = "<" + a,
    g = f.length,
    h = "</" + a + ">",
    n = h.length,
    k = 0;
    do {
        var l = b.toLowerCase(),
        j = l.indexOf(f, k);
        if (-1 == j) break;
        for (var m = b.length, p = "", o = !1, q = !1, k = 0, v = "", k = j; k <= m; k++)
            if (v = b.charAt(k), ('"' == v || "'" == v) && "" == p) p = v;
        else if (('"' == v || "'" == v) && p == v) p = "";
        else if (">" == v && !p) {
            o = !0;
            break
        } else if (("=" == v || " " == v) && !q) q = k;
        if (!o) break;
        q || (q = k);
        m = b.substr(j + g, k - (j + g));
        if (l.substr(1 * j + 1, q - j - 1) == a) {
            q = l.indexOf(h, k);
            if (-1 == q) break;
            for (p = l.indexOf(f, k); - 1 !=
                p && -1 != q && !(p > q);) q = l.indexOf(h, q + n), p = l.indexOf(f, p + g); - 1 != q && (l = k + 1, l = eval(c)(m, b.substr(l, q - l), a, d), b = b.substring(0, j) + l + b.substring(q + n), k = j + l.length)
        }
} while (-1 != j);
return b
}

function simpletag(a, b, c, d) {
    if ("" == trim(b)) return "";
    b = recursion(c, b, "simpletag", d);
    return "[" + d + "]" + b + "[/" + d + "]"
}

function smileycode(a) {
    return $("#smilie_" + a).attr("alt")
}

function strpos(a, b, c) {
    isUndefined(c) && (c = 0);
    a = a.toLowerCase().indexOf(b.toLowerCase(), c);
    return -1 == a ? !1 : a
}

function tabletag(a) {
    var b = "";
    re = /width=(["']?)(\d{1,4}%?)(\1)/i;
    var c = re.exec(a);
    null != c ? b = "%" == c[2].substr(c[2].length - 1, c[2].length) ? 98 >= c[2].substr(0, c[2].length - 1) ? c[2] : "98%" : 560 >= c[2] ? c[2] : "98%" : (re = /width\s?:\s?(\d{1,4})([px|%])/i, c = re.exec(a), null != c && (b = "%" == c[2] ? 98 >= c[1] ? c[1] + "%" : "98%" : 560 >= c[1] ? c[1] : "98%"));
    var d = "";
    re = /(?:background|background-color|bgcolor)[:=]\s*(["']?)((rgb\(\d{1,3}%?,\s*\d{1,3}%?,\s*\d{1,3}%?\))|(#[0-9a-fA-F]{3,6})|([a-zA-Z]{1,20}))(\1)/i;
    c = re.exec(a);
    null != c && (d =
        c[2], b = b ? b : "98%");
    return d ? "[table=" + b + "," + d + "]\n" : b ? "[table=" + b + "]\n" : "[table]\n"
}

function tdtag(a) {
    var b = 1,
    c = 1,
    d = "";
    re = /colspan=(["']?)(\d{1,2})(\1)/i;
    var f = re.exec(a);
    null != f && (b = f[2]);
    re = /rowspan=(["']?)(\d{1,2})(\1)/i;
    f = re.exec(a);
    null != f && (c = f[2]);
    re = /width=(["']?)(\d{1,4}%?)(\1)/i;
    f = re.exec(a);
    null != f && (d = f[2]);
    return in_array(d, ["", "0", "100%"]) ? 1 == b && 1 == c ? "[td]" : "[td=" + b + "," + c + "]" : 1 == b && 1 == c ? "[td=" + d + "]" : "[td=" + b + "," + c + "," + d + "]"
}

function E(a) {
    return !a ? null : document.getElementById(a)
}

function showMenu(a) {
    var b = isUndefined(a.ctrlid) ? a : a.ctrlid,
    c = isUndefined(a.showid) ? b : a.showid,
    d = isUndefined(a.menuid) ? c + "_menu" : a.menuid,
    f = E(b),
    g = E(d);
    if (g) {
        var h = isUndefined(a.mtype) ? "menu" : a.mtype,
        n = isUndefined(a.evt) ? "mouseover" : a.evt,
        k = isUndefined(a.pos) ? "43" : a.pos,
        l = isUndefined(a.layer) ? 1 : a.layer,
        j = isUndefined(a.duration) ? 2 : a.duration,
        m = isUndefined(a.timeout) ? 250 : a.timeout,
        p = isUndefined(a.maxh) ? 600 : a.maxh,
        o = isUndefined(a.cache) ? 1 : a.cache,
        q = isUndefined(a.drag) ? "" : a.drag,
        v = q && E(q) ? E(q) : g,
        x = isUndefined(a.fade) ?
        0 : a.fade,
        w = isUndefined(a.cover) ? 0 : a.cover,
        D = isUndefined(a.zindex) ? JSMENU.zIndex.menu : a.zindex,
        C = isUndefined(a.ctrlclass) ? "" : a.ctrlclass,
        a = isUndefined(a.win) ? "" : a.win,
        D = w ? D + 500 : D;
        "undefined" == typeof JSMENU.active[l] && (JSMENU.active[l] = []);
        if ("click" == n && in_array(d, JSMENU.active[l]) && "win" != h) hideMenu(d, h);
        else {
            "menu" == h && hideMenu(l, h);
            f && !f.getAttribute("initialized") && (f.setAttribute("initialized", !0), f.unselectable = !0, f.outfunc = "function" == typeof f.onmouseout ? f.onmouseout : null, f.onmouseout = function () {
                this.outfunc &&
                this.outfunc();
                3 > j && !JSMENU.timer[d] && (JSMENU.timer[d] = setTimeout(function () {
                    hideMenu(d, h)
                }, m))
            }, f.overfunc = "function" == typeof f.onmouseover ? f.onmouseover : null, f.onmouseover = function (a) {
                doane(a);
                this.overfunc && this.overfunc();
                if ("click" == n) clearTimeout(JSMENU.timer[d]), JSMENU.timer[d] = null;
                else
                    for (var b in JSMENU.timer) JSMENU.timer[b] && (clearTimeout(JSMENU.timer[b]), JSMENU.timer[b] = null)
                });
            if (!g.getAttribute("initialized")) {
                g.setAttribute("initialized", !0);
                g.ctrlkey = b;
                g.mtype = h;
                g.layer = l;
                g.cover =
                w;
                f && f.getAttribute("fwin") && (g.scrolly = !0);
                g.style.position = "absolute";
                g.style.zIndex = D + l;
                g.onclick = function (a) {
                    return doane(a, 0, 1)
                };
                if (3 > j && (1 < j && (g.onmouseover = function () {
                    clearTimeout(JSMENU.timer[d]);
                    JSMENU.timer[d] = null
                }), 1 != j)) g.onmouseout = function () {
                    JSMENU.timer[d] = setTimeout(function () {
                        hideMenu(d, h)
                    }, m)
                };
                if (w) {
                    var y = document.createElement("div");
                    y.id = d + "_cover";
                    y.style.position = "absolute";
                    y.style.zIndex = g.style.zIndex - 1;
                    y.style.left = y.style.top = "0px";
                    y.style.width = "100%";
                    y.style.height = Math.max(document.documentElement.clientHeight,
                        document.body.offsetHeight) + "px";
                    y.style.backgroundColor = "#000";
                    y.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=50)";
                    y.style.opacity = 0.5;
                    y.onclick = function () {
                        hideMenu()
                    };
                    E("append_parent").appendChild(y);
                    _attachEvent(window, "load", function () {
                        y.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + "px"
                    }, document)
                }
            }
            q && (v.style.cursor = "move", v.onmousedown = function (a) {
                try {
                    dragMenu(g, a, 1)
                } catch (b) {}
            });
            w && (E(d + "_cover").style.display = "");
            if (x) {
                var r = function (a) {
                    if (a >
                        100) clearTimeout(b);
                        else {
                            g.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")";
                            g.style.opacity = a / 100;
                            var a = a + 20,
                            b = setTimeout(function () {
                                r(a)
                            }, 40)
                        }
                    };
                    r(0);
                    g.fade = !0
                } else g.fade = !1;
                g.style.display = "";
                f && C && (f.className += " " + C, g.setAttribute("ctrlid", b), g.setAttribute("ctrlclass", C));
                "*" != k && setMenuPosition(c, d, k);
                BROWSER.ie && (7 > BROWSER.ie && a && E("fwin_" + a)) && (E(d).style.left = parseInt(E(d).style.left) - parseInt(E("fwin_" + a).style.left) + "px", E(d).style.top = parseInt(E(d).style.top) - parseInt(E("fwin_" +
                    a).style.top) + "px");
                p && g.scrollHeight > p && (g.style.height = p + "px", BROWSER.opera ? g.style.overflow = "auto" : g.style.overflowY = "auto");
                j || setTimeout("hideMenu('" + d + "', '" + h + "')", m);
                in_array(d, JSMENU.active[l]) || JSMENU.active[l].push(d);
                g.cache = o;
                l > JSMENU.layer && (JSMENU.layer = l)
            }
        }
    }

    function setMenuPosition(a, b, c) {
        var d = E(a),
        a = b ? E(b) : E(a + "_menu");
        if (isUndefined(c) || !c) c = "43";
        var b = parseInt(c.substr(0, 1)),
        f = parseInt(c.substr(1, 1)),
        g = -1 != c.indexOf("!") ? 1 : 0,
        h = 0,
        n = 0,
        k = h = 0,
        l = 0,
        j = 0,
        m = 0,
        p = 0,
        o = 0,
        q = 0,
        v = 0;
        if (a && (!(0 < b) || d)) {
            d && (h = fetchOffset(d), n = h.left, h = h.top, k = d.offsetWidth, l = d.offsetHeight);
            p = a.offsetWidth;
            o = a.offsetHeight;
            switch (b) {
                case 1:
                q = n;
                v = h;
                break;
                case 2:
                q = n + k;
                v = h;
                break;
                case 3:
                q = n + k;
                v = h + l;
                break;
                case 4:
                q = n, v = h + l
            }
            switch (f) {
                case 0:
                a.style.left = (document.body.clientWidth - a.clientWidth) /
                2 + "px";
                m = (document.documentElement.clientHeight - a.clientHeight) / 2;
                break;
                case 1:
                j = q - p;
                m = v - o;
                break;
                case 2:
                j = q;
                m = v - o;
                break;
                case 3:
                j = q;
                m = v;
                break;
                case 4:
                j = q - p, m = v
            }
            var x = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
            w = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            g || ((in_array(f, [1, 4]) && 0 > j ? (j = q, in_array(b, [1, 4]) && (j += k)) : j + p > w + document.body.clientWidth && n >= p && (j = q - p, in_array(b, [2, 3]) ? j -= k : 4 == b && (j += k)), in_array(f, [1, 2]) && 0 > m) ? (m = v, in_array(b, [1, 2]) && (m +=
                l)) : m + o > x + document.documentElement.clientHeight && h >= o && (m = v - o, in_array(b, [3, 4]) && (m -= l)));
            "210" == c.substr(0, 3) && (j += 69 - k / 2, m -= 5, "TEXTAREA" == d.tagName && (j -= k / 2, m += l / 2));
            if (0 == f || a.scrolly) BROWSER.ie && 7 > BROWSER.ie ? 0 == f && (m += x) : (a.scrolly && (m -= x), a.style.position = "fixed");
            j && (a.style.left = j + "px");
            m && (a.style.top = m + "px");
            0 == f && (BROWSER.ie && !document.documentElement.clientHeight) && (a.style.position = "absolute", a.style.top = (document.body.clientHeight - a.clientHeight) / 2 + "px");
            a.style.clip && !BROWSER.opera &&
            (a.style.clip = "rect(auto, auto, auto, auto)")
        }
    }

    function hideMenu(a, b) {
        a = isUndefined(a) ? "" : a;
        b = isUndefined(b) ? "menu" : b;
        if ("" == a)
            for (var c = 1; c <= JSMENU.layer; c++) hideMenu(c, b);
                else if ("number" == typeof a)
                    for (c in JSMENU.active[a]) hideMenu(JSMENU.active[a][c], b);
                        else if ("string" == typeof a) {
                            var d = E(a);
                            if (d && !(b && d.mtype != b)) {
                                var f = c = "";
                                if ((c = E(d.getAttribute("ctrlid"))) && (f = d.getAttribute("ctrlclass"))) c.className = c.className.replace(RegExp(" " + f), "");
                                clearTimeout(JSMENU.timer[a]);
                                var g = function () {
                                    d.cache ? "hidden" != d.style.visibility && (d.style.display =
                                        "none", d.cover && (E(a + "_cover").style.display = "none")) : (d.parentNode.removeChild(d), d.cover && E(a + "_cover").parentNode.removeChild(E(a + "_cover")));
                                    var b = [],
                                    c;
                                    for (c in JSMENU.active[d.layer]) a != JSMENU.active[d.layer][c] && b.push(JSMENU.active[d.layer][c]);
                                        JSMENU.active[d.layer] = b
                                };
                                if (d.fade) {
                                    var h = function (a) {
                                        if (0 == a) clearTimeout(b), g();
                                        else {
                                            d.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")";
                                            d.style.opacity = a / 100;
                                            var a = a - 20,
                                            b = setTimeout(function () {
                                                h(a)
                                            }, 40)
                                        }
                                    };
                                    h(100)
                                } else g()
                            }
                        }
                    }

                    function fetchOffset(a, b) {
                        var c = 0,
                        d = 0;
                        if (a.getBoundingClientRect && !(!b ? 0 : b)) {
                            var d = a.getBoundingClientRect(),
                            f = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                            c = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                            "rtl" == document.documentElement.dir && (c = c + document.documentElement.clientWidth - document.documentElement.scrollWidth);
                            c = d.left + c - document.documentElement.clientLeft;
                            d = d.top + f - document.documentElement.clientTop
                        }
                        if (0 >= c || 0 >= d) {
                            c = a.offsetLeft;
                            for (d = a.offsetTop; null !=
                                (a = a.offsetParent);) position = getCurrentStyle(a, "position", "position"), "relative" != position && (c += a.offsetLeft, d += a.offsetTop)
                        }
                    return {
                        left: c,
                        top: d
                    }
                };
                $(document).ready(function () {
                    $.fn.wait = function (a, b) {
                        a = a || 1E3;
                        return this.queue(b || "fx", function () {
                            var b = this;
                            setTimeout(function () {
                                $(b).dequeue()
                            }, a)
                        })
                    };
                    $(function () {
                        $("[placeholder]").focus(function () {
                            var a = $(this);
                            a.val() == a.attr("placeholder") && (a.val(""), a.removeClass("placeholder"))
                        }).blur(function () {
                            var a = $(this);
                            if ("" == a.val() || a.val() == a.attr("placeholder")) a.addClass("placeholder"), a.val(a.attr("placeholder"))
                        }).blur();
                        $("[placeholder]").parents("form").submit(function () {
                            $(this).find("[placeholder]").each(function () {
                                var a =
                                $(this);
                                a.val() == a.attr("placeholder") && a.val("")
                            })
                        })
                    });
                    $(function () {
                        function a() {
                            var a = b.scrollTop();
                            a >= d && !f ? (f = 1, c.addClass("subnav-fixed")) : a <= d && f && (f = 0, c.removeClass("subnav-fixed"))
                        }
                        var b = $(window),
                        c = $(".subnav"),
                        d = c.length && c.offset().top - 50,
                        f = 0;
                        a();
                        c.on("click", function () {
                            f || setTimeout(function () {
                                b.scrollTop(b.scrollTop() - 47)
                            }, 10)
                        });
                        b.on("scroll", a)
                    });
                    $(function () {
                        var a;
                        $("#con").hover(function () {
                            clearInterval(a)
                        }, function () {
                            a = setInterval(function () {
                                var a = $("#con ul"),
                                c = a.find("li:last").height();
                                a.animate({
                                    marginTop: c + 20 + "px"
                                }, 1E3, function () {
                                    a.find("li:last").prependTo(a);
                                    a.find("li:first").hide();
                                    a.css({
                                        marginTop: 0
                                    });
                                    a.find("li:first").fadeIn(1E3)
                                })
                            }, 5E3)
                        }).trigger("mouseleave")
                    });
                    $("input[type=text][title],input[type=password][title],textarea[title]").each(function (a) {
                        $(this).addClass("input-prompt-" + a);
                        var b = $('<span class="input-prompt"/>');
                        $(b).attr("id", "input-prompt-" + a);
                        $(b).append($(this).attr("title"));
                        $(b).click(function () {
                            $(this).hide();
                            $("." + $(this).attr("id")).focus()
                        });
                        "" !=
                        $(this).val() && $(b).hide();
                        $(this).before(b);
                        $(this).focus(function () {
                            $("#input-prompt-" + a).hide()
                        });
                        $(this).blur(function () {
                            "" == $(this).val() && $("#input-prompt-" + a).show()
                        })
                    });
                    window.FXL_IE6 = !+"\v1" && !("maxHeight" in document.body.style) ? 1 : 0;
                    $("#BackToTop").hide();
                    $(function () {
                        $(window).scroll(function () {
                            100 < $(this).scrollTop() ? $("#BackToTop").fadeIn() : $("#BackToTop").fadeOut()
                        });
                        $("#BackToTop").click(function () {
                            $("body,html").animate({
                                scrollTop: 0
                            }, 800)
                        })
                    });
                    $(function () {
                        $("#slideshow .slideshow").append('<div id="loadingPins" style="width:100%;height:100%;" class="active"><img style="margin-top:100px;" src="' +
                            base_url + '/assets/img/ajax-loader.gif" alt="\u6b63\u5728\u52a0\u8f7d..."></div>');
                        $("#slideshow .slideshow").imagesLoaded(function () {
                            function a() {
                                var a = $("#slideshow .slideshow .slide-item.active");
                                0 == a.length && (a = $("#slideshow .slideshow .slide-item:first"));
                                var b = a.prev().length ? a.prev() : $("#slideshow .slideshow .slide-item:last");
                                a.removeClass("active");
                                a.css({
                                    "z-index": 0
                                }).animate({
                                    opacity: 0
                                }, 1E3, function () {});
                                b.css({
                                    "z-index": 9
                                }).addClass("active").animate({
                                    opacity: 1
                                }, 1E3, function () {})
                            }

                            function b() {
                                var a =
                                $("#slideshow .slideshow .slide-item.active");
                                0 == a.length && (a = $("#slideshow .slideshow .slide-item:last"));
                                var b = a.next().length ? a.next() : $("#slideshow .slideshow .slide-item:first");
                                a.removeClass("active");
                                a.css({
                                    "z-index": 0
                                }).animate({
                                    opacity: 0
                                }, 1E3, function () {});
                                b.css({
                                    "z-index": 9
                                }).addClass("active").animate({
                                    opacity: 1
                                }, 1E3, function () {})
                            }
                            $("#slideshow .slideshow #loadingPins").remove();
                            $("#slideshow .slideshow .slide-item").css({
                                opacity: 0,
                                "z-index": 0
                            });
                            $("#slideshow .slideshow .slide-item:first").css({
                                opacity: 1,
                                "z-index": 9
                            }).addClass("active");
                            var c = setInterval(function () {
                                b()
                            }, 5E3);
                            $("#prev").click(function (b) {
                                b.preventDefault();
                                a()
                            });
                            $("#next").click(function (a) {
                                a.preventDefault();
                                b()
                            });
                            $("#slideshow").hover(function () {
                                $("#prev").removeClass("hide");
                                $("#next").removeClass("hide");
                                clearInterval(c)
                            }, function () {
                                $("#prev").addClass("hide");
                                $("#next").addClass("hide");
                                c = setInterval(function () {
                                    b()
                                }, 5E3)
                            })
                        })
});
$.oPopover("user_profile", {
    autoDirection: !0,
    remote: $("#data-actions").attr("data-userprofile-url"),
    elem_mark: 'a[data-user-profile="1"]',
    data_id_mark: "data-user-id",
    tpl_mark: "user_profile_tpl"
})
});
(function (a) {
    function b(a) {
        var b = this.config,
        b = c({
            id: null,
            className: "popover",
            autoDirection: !0,
            remote: null,
            elem_mark: 'a[data-popover="1"]',
            data_id_mark: "data-id",
            tpl_mark: "popover_tpl",
            outer_tpl: '<div id="%ID" class="ui-dialog %CLASSNAME"></div>',
            loading_tpl: '<p class="message"><img src="' + base_url + '/assets/img/s_loading.gif" />Loading...</p><b class="arrow_t"><i class="arrow_inner"></i></b>',
            error_tpl: '<p class="message">%MESSAGE</p><b class="arrow_t"><i class="arrow_inner"></i></b>'
        }, a || {});
        b.id =
        b.id || "ui-popover-" + f++;
        this.config = b;
       // edit by porter at 2013-12-20 15:35:11 阻止瀑布流中鼠标放在头像上弹出用户信息框
        //this._createHTML()
        // end edit
    }

    function c(a, b) {
        for (var c in b) a[c] = b[c];
            return a
    }
    var d = {};
    a.oPopover = function (a, c) {
        if (!a || !d[a]) {
            var f = new b(c),
            a = !a ? f.elem[0].id : a;
            d[a] = f
        }
        return d[a]
    };
    var f = 0;
    c(b.prototype, {
        width: function (a) {
            this.elem.width(a);
            this.center();
            return this
        },
        align: function (b) {
            var c = this.popOverlay,
            d = this.config;
            if (this.showing) {
                b.find("img").length && (b = b.find("img").eq(0));
                var f = b.offset(),
                l = Math.min(f.left - 20, a(window).width() - c.outerWidth() - 30);
                if (d.autoDirection) {
                    var d =
                    f.top - c.outerHeight() - 4,
                    j = !1;
                    5 > d && (d = f.top + a(b).outerHeight() + 4, j = !0);
                    c.css({
                        left: l,
                        top: d
                    });
                    j ? (c.find(".arrow_t").css({
                        left: f.left - l,
                        display: "block"
                    }), c.find(".arrow_b").css({
                        display: "none"
                    })) : (c.find(".arrow_b").css({
                        left: f.left - l,
                        display: "block"
                    }), c.find(".arrow_t").css({
                        display: "none"
                    }))
                } else d = f.top + a(b).outerHeight() + 4, c.css({
                    left: l,
                    top: d
                }), c.find(".arrow_t").css({
                    left: f.left - l,
                    display: "block"
                })
            }
        },
        hide: function () {
            var a = this.popOverlay;
            this.showing = !1;
            a && a.hide()
        },
        laterHide: function () {
            var a = this,
            b = a.showTimer;
            a.hideTimer = setTimeout(function () {
                a.hide()
            }, 300);
            b && (clearTimeout(b), a.showTimer = null)
        },
        show: function (b) {
            var c = this,
            d = this.config;
            c.showing = !0;
            if (!c.popOverlay) {
                var f = a(d.outer_tpl.replace(/%ID/, d.id).replace(/%CLASSNAME/, d.className));
                c.popOverlay = a(f).appendTo("body");
                c.popOverlay.hover(function () {
                    c.hideTimer && (clearTimeout(c.hideTimer), c.hideTimer = null)
                }, function () {
                    c.laterHide()
                })
            }
            var l = b.attr(d.data_id_mark);
            c.popOverlay.data("data-id") === l ? (c.popOverlay.show(), c.align(b)) : (c.popOverlay.data("data-id",
                l), c.popData[l] ? (c.popOverlay.html(c.popData[l]).show(), c.align(b)) : (c.popOverlay.addClass("loading").html(d.loading_tpl).show(), c.align(b), a.ajax({
                    url: d.remote,
                    type: "get",
                    data: {
                        dataid: l,
                        radom: random(3)
                    },
                    dataType: "json"
                }).success(function (f) {
                    !0 === f.success ? (c.popOverlay.html(Mustache.to_html(a("#" + d.tpl_mark).html(), f)), c.popOverlay.removeClass("loading"), c.align(b), c.popData[l] = c.popOverlay.html()) : (c.popOverlay.html(d.error_tpl.replace(/%MESSAGE/, f.message)), c.popOverlay.removeClass("loading"),
                        c.align(b))
                }).error(function () {
                    c.popOverlay.html(d.error_tpl);
                    c.popOverlay.removeClass("loading");
                    c.align(b)
                })))
},
_createHTML: function () {
    var b = this,
    c = b.config;
    b.popData = {};
    b.popOverlay = null;
    b.showing = !1;
    b.hideTimer = null;
    b.showTimer = null;
    a(c.elem_mark).live("mouseenter", function () {
        var c = a(this);
        b.hideTimer && (clearTimeout(b.hideTimer), b.hideTimer = null);
        b.showTimer && clearTimeout(b.showTimer);
        b.showTimer = setTimeout(function () {
            b.show(c)
        }, 600)
    }).live("mouseleave", function () {
        b.laterHide()
    })
}
})
})(jQuery);
(function (a) {
    function b(a) {
        var b = this.config,
        b = c({
            id: null,
            width: "630",
            center: !0,
            mask: !0,
            close: !0,
            beforeShow: function () {},
            afterShow: function () {},
            beforeHide: function () {},
            onHide: function () {},
            scrollTimer: null,
            className: "ui-dialog",
            tpl: '<div id="%ID" class="%CLASSNAME"><div class="hd"><button type="button" class="close">\u00d7</button><h2>Loading</h2></div><div class="bd"><div class="ui-loading">Loading...</div></div><div class="ft"></div</div>'
        }, a || {});
        b.id = b.id || "ui-dialog-" + f++;
        this.config = b;
        this._createHTML()
    }

    function c(a, b) {
        for (var c in b) a[c] = b[c];
            return a
    }
    var d = {};
    a.oDialog = function (a, c) {
        if (!a || !d[a]) {
            var f = new b(c),
            a = !a ? f.elem[0].id : a;
            d[a] = f
        }
        return d[a]
    };
    a.oFDialog = function (a) {
        return d[a] ? d[a] : null
    };
    var f = 0;
    c(b.prototype, {
        _status: 400,
        isShow: function () {
            return 200 === this._status
        },
        width: function (a) {
            this.elem.width(a);
            this.center();
            return this
        },
        center: function () {
            if (400 !== this._status) {
                var b = this.elem,
                c = a(window),
                d = c.width(),
                f = c.height();
                b.css("top", (f - b.height()) / 2 + (this._isIE6 ? c.scrollTop() : 0));
                b.css("left", (d - b.width()) / 2 + (this._isIE6 ? c.scrollLeft() : 0));
                this.config.mask && this._isIE6 && this.mask.css("height", a(document).height());
                a(this).triggerHandler("center");
                return this
            }
        },
        head: function (a) {
            this.elem.children("div.hd").children("h2").html(a);
            return this
        },
        body: function (a) {
            this.elem.children("div.bd").html(a);
            return this
        },
        footer: function (a) {
            var b = this.elem.children("div.ft");
            b.html(a);
            b.addClass("ui-footer");
            return this
        },
        show: function () {
            var b = this,
            c = this.config,
            d = b.elem,
            f = {
                visibility: "",
                opacity: 0
            }, l =
            parseInt(a.browser.version, 10);
            a(b).triggerHandler("beforeShow");
            c.beforeShow();
            b._status = 200;
            !0 === c.center && d.imagesLoaded(function () {
                b.center()
            });
            c.mask && b.mask.css({
                visibility: ""
            });
            a.browser.msie && 9 > l ? (b._isIE6 && c.mask && b.mask.css({
                position: "absolute",
                height: a(document).height()
            }), d.css({
                visibility: ""
            }), a(b).triggerHandler("show")) : (d.css(f), d.animate({
                opacity: 1
            }, 200, function () {
                a(b).triggerHandler("show")
            }));
            return b
        },
        hide: function () {
            var b = this,
            c = b.config,
            d = b.elem;
            if (400 !== b._status){
                b._status = 400;
                d.css({
                    visibility: "hidden",
                    opacity: ""
                });
                c.mask && b.mask.css({
                    visibility: "hidden"
                });
                a(b).triggerHandler("hide");
                c.onHide()
            }

        },
        _createHTML: function () {
            var b = this,
            c = b.config,
            d = null,
            f = a(c.tpl.replace(/%ID/, c.id).replace(/%CLASSNAME/, c.className));
            f.css({
                visibility: "hidden",
                width: c.width
            });
            !0 === c.close ? a(f).find("button.close").click(function (a) {
                a.preventDefault();
                b.hide();
            }) : a(f).find("button.close").remove();
            b.elem = f;
            a("body").append(f);
            !0 === c.mask && (c = a('<div id="' + c.id + '_mask" class="ui-mask"></div>'), c.css({
                visibility: "hidden"
            }), b.mask = c, a("body").append(c));
            a(window).resize(function () {
                d === null && (d = setTimeout(function () {
                    d = null;
                    b.center()
                }, 300))
            });
            a(b.elem).resize(function () {
                d === null && (d = setTimeout(function () {
                    d = null;
                    b.center()
                }, 300))
            });
            a.browser.msie && 7 > parseInt(a.browser.version, 10) && (b._isIE6 = !0, a(window).scroll(function () {
                d === null && (d = setTimeout(function () {
                    d = null;
                    b.center()
                }, 300))
            }))
        }
    })
})(jQuery);
(function (a) {
    function b(a) {
        var b = this.config,
        b = c({
            id: null,
            className: "editor",
            remote: null,
            initialtext: "",
            editorcurrentheight: 130,
            editorminheight: 130,
            editorcontroltop: !1,
            editorid: "editor"
        }, a || {});
        b.id = b.id || "ui-editor-" + f++;
        this.config = b;
        this._createHTML()
    }

    function c(a, b) {
        for (var c in b) a[c] = b[c];
            return a
    }
    var d = {};
    a.oEditor = function (a, c) {
        if (!a || !d[a]) {
            var f = new b(c),
            a = !a ? f.elem[0].id : a;
            d[a] = f
        }
        return d[a]
    };
    a.oFEditor = function (a) {
        return d[a] ? d[a] : null
    };
    var f = 0;
    c(b.prototype, {
        writeEditorContents: function (a) {
            if (this.wysiwyg) {
                if ("" ==
                    a && (BROWSER.firefox || BROWSER.opera)) a = "<p></p>";
                    a = bbcode2html(a);
                if (this.initialized && !(BROWSER.firefox && "3" <= BROWSER.firefox || BROWSER.opera)) this.editdoc.body.innerHTML = a;
                else if (a = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head id="editorheader"><meta http-equiv="Content-Type" content="text/html; charset=' + charset + '" />' + (BROWSER.ie && 7 < BROWSER.ie ? '<meta http-equiv="X-UA-Compatible" content="IE=7" />' : "") + '<link rel="stylesheet" type="text/css" href="' +
                    base_url + 'themes/puzzing/editor/wysiwyg.css" />' + (BROWSER.ie ? "<script>window.onerror = function() { return true; }<\/script>" : "") + "</head><body>" + a + "</body></html>", this.editdoc.designMode = "off", this.editdoc = this.editwin.document, this.editdoc.open("text/html", "replace"), this.editdoc.write(a), this.editdoc.close(), BROWSER.ie || (a = document.createElement("script"), a.type = "text/javascript", a.text = "window.onerror = function() { return true; }", this.editdoc.getElementById("editorheader").appendChild(a)),
                    this.editdoc.body.contentEditable = !0, this.editdoc.body.spellcheck = !1, this.initialized = !0, BROWSER.safari) this.editdoc.onclick = this.safariSel
} else this.textobj.value = a;
this.setEditorStyle()
},
safariSel: function (a) {
    a = a.target;
    if (a.tagName.match(/(img|embed)/i)) {
        var b = this.editwin.getSelection(),
        c = this.editdoc.createRange(!0);
        c.selectNode(a);
        b.removeAllRanges();
        b.addRange(c)
    }
},
setEditorStyle: function () {
    if (this.wysiwyg) this.textobj.style.display = "none", this.editbox.style.display = "", this.editbox.className =
        this.textobj.className, BROWSER.ie && (this.editdoc.body.style.border = "0px", this.editdoc.body.addBehavior("#default#userData"), this.editwin.focus()), this.editbox.style.height = this.editbox.contentWindow.document.body.style.height = this.config.editorcurrentheight + "px";
    else {
        var a = this.textobj.parentNode.getElementsByTagName("iframe")[0];
        a && (this.textobj.style.display = "", a.style.display = "none")
    }
},
addSnapshot: function (a) {
    this.stack[this.cursor] != a && (this.cursor++, this.stack[this.cursor] = a, isUndefined(this.stack[this.cursor +
        1]) || (this.stack[this.cursor + 1] = null))
},
setCaretAtEnd: function () {
    this.wysiwyg ? this.editdoc.body.innerHTML += "" : this.editdoc.value += ""
},
moveCursor: function (a) {
    var b = this.cursor + a;
    0 <= b && (null != this.stack[b] && !isUndefined(this.stack[b])) && (this.cursor += a)
},
getSnapshot: function () {
    return !isUndefined(this.stack[this.cursor]) && null != this.stack[this.cursor] ? this.stack[this.cursor] : !1
},
checklength: function () {
    var a = this.config.editorid,
    b = this.wysiwyg ? html2bbcode(this.getEditorContents()) : parseurl(this.textobj.value);
    E(a + "_chck_tip").innerHTML = "&nbsp;\u8fd8\u53ef\u4ee5\u8f93\u5165" + (this.postmaxchars - mb_strlen(b)) + "\u5b57\u7b26\uff08" + this.postminchars + "-" + this.postmaxchars + "\uff09"
},
setEditorEvents: function () {
    var a = this;
    if (BROWSER.firefox || BROWSER.opera) a.editdoc.addEventListener("mouseup", function (b) {
        a.mouseUp(b)
    }, !0), a.editdoc.addEventListener("keyup", function (b) {
        a.keyUp(b)
    }, !0), a.editwin.addEventListener("keydown", function (b) {
        a.keyDown(b)
    }, !0);
    else if (a.editdoc.attachEvent) try {
        a.editdoc.body.attachEvent("onmouseup",
            function (b) {
                return a.mouseUp(b)
            }), a.editdoc.body.attachEvent("onkeyup", function (b) {
                return a.keyUp(b)
            }), a.editdoc.body.attachEvent("onkeydown", function (b) {
                return a.keyDown(b)
            })
        } catch (b) {}
    },
    mouseUp: function () {
        this.wysiwyg && this.setContext()
    },
    keyUp: function () {
        this.wysiwyg && this.setContext();
        this.checklength()
    },
    keyDown: function (a) {
        this.ctlent(a)
    },
    setContext: function (a) {
        var b = this.config,
        a = !a ? "" : a,
        c = "bold italic underline justifyleft justifycenter justifyright insertorderedlist insertunorderedlist".split(" "),
        d;
        for (d in c) {
            var f = E(b.editorid + "_" + c[d]);
            if (null != f)
                if ("clear" == a) f.className = "";
            else {
                try {
                    var j = this.editdoc.queryCommandState(c[d])
                } catch (m) {
                    j = !1
                }
                isUndefined(f.state) && (f.state = !1);
                f.state != j && (f.state = j, this.buttonContext(f, j ? "mouseover" : "mouseout"))
            }
        }
        try {
            var p = this.editdoc.queryCommandValue("fontname")
        } catch (o) {
            p = null
        }
        "" == p && !BROWSER.ie && window.getComputedStyle ? p = this.editdoc.body.style.fontFamily : null == p && (p = "");
        p = p && "clear" != a ? p : "\u5b57\u4f53";
        p != E(b.editorid + "_font").fontstate && (thingy = 0 <
            p.indexOf(",") ? p.substr(0, p.indexOf(",")) : p, E(b.editorid + "_font").innerHTML = thingy, E(b.editorid + "_font").fontstate = p);
        try {
            var q = this.editdoc.queryCommandValue("fontsize");
            if (null == q || "" == q || "clear" == a) q = this.formatFontsize(this.editdoc.body.style.fontSize);
            else {
                var v = q.substr(-2);
                if ("px" == v || "pt" == v) q = this.formatFontsize(q)
            }
    } catch (x) {
        q = "\u5927\u5c0f"
    }
    q != E(b.editorid + "_size").sizestate && (null == E(b.editorid + "_size").sizestate && (E(b.editorid + "_size").sizestate = ""), E(b.editorid + "_size").innerHTML = q, E(b.editorid +
        "_size").sizestate = q)
},
buttonContext: function (a, b) {
    if ("mouseover" == b) {
        a.style.cursor = "pointer";
        var c = a.state ? "down" : "hover";
        a.mode != c && (a.mode = c, a.className = "hover")
    } else c = a.state ? "selected" : "normal", a.mode != c && (a.mode = c, a.className = "selected" == c ? "hover" : "")
},
formatFontsize: function (a) {
    switch (a) {
        case "7.5pt":
        case "10px":
        return 1;
        case "13px":
        case "10pt":
        return 2;
        case "16px":
        case "12pt":
        return 3;
        case "18px":
        case "14pt":
        return 4;
        case "24px":
        case "18pt":
        return 5;
        case "32px":
        case "24pt":
        return 6;
        case "48px":
        case "36pt":
        return 7;
        default:
        return "\u5927\u5c0f"
    }
},
initEditor: function () {
    var a = this,
    b = a.config,
    c = b.editorid;
    if (BROWSER.other) E(b.editorid + "_controls").style.display = "none";
    else {
        for (var b = E(b.editorid + "_controls").getElementsByTagName("a"), d = 0; d < b.length; d++) - 1 != b[d].id.indexOf(c + "_") && (b[d].href = "javascript:;", _attachEvent(b[d], "mouseover", function (b) {
            a.setEditorTip(BROWSER.ie ? window.event.srcElement.title : b.target.title)
        }), "url" == b[d].id.substr(b[d].id.indexOf("_") + 1) ? b[d].onclick = function () {
            a.puzzcode("unlink");
            a.puzzcode("url");
            doane()
        } : b[d].getAttribute("init") || (b[d].onclick = function () {
            a.puzzcode(this.id.substr(this.id.indexOf("_") + 1));
            doane()
        }), b[d].onmouseout = function () {
            a.setEditorTip("")
        });
            c = E(c + "_controls");
            a.setUnselectable(c);
            a.checkFocus();
            a.checklength()
        }
    },
    getEditorContents: function () {
        return this.wysiwyg ? this.editdoc.body.innerHTML : this.editdoc.value
    },
    checkFocus: function () {
        if (this.wysiwyg) try {
            this.editwin.focus()
        } catch (a) {
            this.editwin.document.body.focus()
        } else this.textobj.focus()
    },
    setUnselectable: function (a) {
        if (BROWSER.ie &&
            4 < BROWSER.ie && "undefined" != typeof a.tagName) {
            if (a.hasChildNodes())
                for (var b = 0; b < a.childNodes.length; b++) this.setUnselectable(a.childNodes[b]);
                    "INPUT" != a.tagName && (a.unselectable = "on")
            }
        },
        setEditorTip: function (a) {
            E(this.config.editorid + "_tip").innerHTML = "&nbsp;" + a
        },
        insertAt: function (a) {
            this.checkFocus();
            var b = "@";
            a && (b += a + " ");
            this.insertText(b, strlen(b), 0);
            hideMenu()
        },
        puzzcode: function (a, b) {
            var c = this.editdoc,
            d = this.wysiwyg;
            "redo" != a && this.addSnapshot(this.getEditorContents());
            this.checkFocus();
            if (in_array(a,
                "sml url quote code free hide aud vid fls image pasteword".split(" ")) || "tbl" == a || in_array(a, ["fontname", "fontsize", "forecolor", "backcolor"]) && !b) this.showEditorMenu(a);
                else if ("autotypeset" == a) this.autoTypeset();
            else if ("at" == a) this.insertAt();
            else {
                if (!d && "removeformat" == a) {
                    var c = ["b", "i", "u"],
                    f = ["font", "color", "backcolor", "size"],
                    j = this.getSel();
                    if (!1 === j) return;
                    for (var m in c) j = this.stripSimple(c[m], j);
                        for (m in f) j = this.stripComplex(f[m], j);
                            this.insertText(j)
                    } else if ("undo" == a) {
                        if (this.addSnapshot(this.getEditorContents()),
                            this.moveCursor(-1), !1 !== (j = this.getSnapshot())) d ? c.body.innerHTML = j : c.value = j
                    } else if ("redo" == a) {
                        if (this.moveCursor(1), !1 !== (j = this.getSnapshot())) d ? c.body.innerHTML = j : c.value = j
                    } else if (!d && "unlink" == a) j = this.getSel(), j = this.stripSimple("url", j), j = this.stripComplex("url", j), this.insertText(j);
                else if ("floatleft" == a || "floatright" == a)
                    if (b = "floatleft" == a ? "left" : "right", d) {
                        if (txt = this.getSel()) argm = "left" == b ? "right" : "left", this.insertText('<br style="clear: both"><table class="float" style="float: ' +
                            b + "; margin-" + argm + ': 5px;"><tbody><tr><td>' + txt + "</td></tr></tbody></table>", !0)
                    } else j = "[float=" + b + "]", (txt = this.getSel()) ? (txt = j + txt + "[/float]", this.insertText(txt, strlen(txt), 0)) : this.insertText(j + "[/float]", j.length, 8);
                else if ("chck" == a) this.checklength();
                else if ("tpr" == a) confirm("\u60a8\u786e\u8ba4\u8981\u6e05\u9664\u6240\u6709\u5185\u5bb9\u5417\uff1f") && this.clearContent();
                else {
                    j = "backcolor" == a && !BROWSER.ie ? "hilitecolor" : a;
                    try {
                        var p = this.applyFormat(j, !1, isUndefined(b) ? !0 : b)
                    } catch (o) {
                        p = !1
                    }
                }
                "undo" !=
                a && this.addSnapshot(this.getEditorContents());
                d && this.setContext(a);
                in_array(a, "bold italic underline strikethrough inserthorizontalrule fontname fontsize forecolor backcolor justifyleft justifycenter justifyright insertorderedlist insertunorderedlist floatleft floatright removeformat unlink undo redo".split(" ")) && hideMenu();
                doane();
                return p
            }
        },
        wrapTags: function (a, b, c) {
            isUndefined(c) && (c = this.getSel(), c = !1 === c ? "" : c + "");
            var b = !1 !== b ? "[" + a + "=" + b + "]" : "[" + a + "]",
            d = "[/" + a + "]";
            this.insertText(b + c + d, strlen(b),
                strlen(d), in_array(a, ["code", "quote", "free", "hide"]) ? !0 : !1)
        },
        applyFormat: function (a, b, c) {
            var d = this.editdoc;
            if (this.wysiwyg) d.execCommand(a, isUndefined(b) ? !1 : b, isUndefined(c) ? !0 : c);
            else switch (a) {
                case "bold":
                case "italic":
                case "underline":
                case "strikethrough":
                this.wrapTags(a.substr(0, 1), !1);
                break;
                case "inserthorizontalrule":
                this.insertText("[hr]", 4, 0);
                break;
                case "justifyleft":
                case "justifycenter":
                case "justifyright":
                this.wrapTags("align", a.substr(7));
                break;
                case "fontname":
                this.wrapTags("font", c);
                break;
                case "fontsize":
                this.wrapTags("size", c);
                break;
                case "forecolor":
                this.wrapTags("color", c);
                break;
                case "hilitecolor":
                case "backcolor":
                this.wrapTags("backcolor", c)
            }
        },
        clearContent: function () {
            this.wysiwyg ? this.editdoc.body.innerHTML = BROWSER.firefox ? "<br />" : "" : this.textobj.value = ""
        },
        showEditorMenu: function (b, c) {
            var d = this,
            f = d.config,
            l = f.editorid,
            j = d.wysiwyg,
            m, p, o = "",
            q = l + (c ? "_cst" + c + "_" : "_") + b,
            v = "[" + b + "]",
            x = "[/" + b + "]",
            w = E(q + "_menu"),
            D = [0, 0],
            C = "43!";
            BROWSER.ie && (m = d.wysiwyg ? d.editdoc.selection.createRange() :
                document.selection.createRange(), D = d.getCaret());
            p = m ? d.wysiwyg ? m.htmlText : m.text : d.getSel();
            if (w)(null !== E(q).getAttribute("menupos") && (C = E(q).getAttribute("menupos")), null !== E(q).getAttribute("menuwidth") && (w.style.width = E(q).getAttribute("menuwidth") + "px"), "00" == C) ? (w.className = "fwinmask", "hidden" == E(l + "_" + b + "_menu").style.visibility ? E(l + "_" + b + "_menu").style.visibility = "visible" : showMenu({
                ctrlid: q,
                mtype: "win",
                evt: "click",
                pos: C,
                timeout: 250,
                duration: 3,
                drag: q + "_ctrl"
            })) : showMenu({
                ctrlid: q,
                evt: "click",
                pos: C,
                timeout: 250,
                duration: in_array(b, ["fontname", "fontsize", "sml"]) ? 2 : 3,
                drag: 1
            });
            else {
                switch (b) {
                    case "url":
                    o = '\u8bf7\u8f93\u5165\u94fe\u63a5\u5730\u5740:<br /><input type="text" id="' + q + '_param_1" style="width: 98%" value="" class="px" />' + (p ? "" : '<br />\u8bf7\u8f93\u5165\u94fe\u63a5\u6587\u5b57:<br /><input type="text" id="' + q + '_param_2" style="width: 98%" value="" class="px" />');
                    break;
                    case "forecolor":
                    d.showColorBox(q, 1);
                    return;
                    case "backcolor":
                    d.showColorBox(q, 1, "", 1);
                    return;
                    case "sml":
                    d.showSmiles(q,
                        1);
                    return;
                    case "fontname":
                    d.showFontList(q, 1);
                    return;
                    case "fontsize":
                    d.showFontSizeList(q, 1);
                    return;
                    case "code":
                    j && (v = '<div class="blockcode"><blockquote>', x = "</blockquote></div><br />");
                    case "quote":
                    j && "quote" == b && (v = '<div class="quote"><blockquote>', x = "</blockquote></div><br />");
                    case "tbl":
                    o = '<p class="pbn">\u8868\u683c\u884c\u6570: <input type="text" id="' + q + '_param_1" size="2" value="2" class="px" /> &nbsp; \u8868\u683c\u5217\u6570: <input type="text" id="' + q + '_param_2" size="2" value="2" class="px" /></p><p class="pbn">\u8868\u683c\u5bbd\u5ea6: <input type="text" id="' +
                    q + '_param_3" size="2" value="" class="px" /> &nbsp; \u80cc\u666f\u989c\u8272: <input type="text" id="' + q + '_param_4" size="2" class="px" onclick="showColorBox(this.id, 2)" /></p><p class="xg2 pbn" style="cursor:pointer" onclick="showDialog(E(\'tbltips_msg\').innerHTML, \'notice\', \'\u5c0f\u63d0\u793a\', null, 0)"><img id="tbltips" title="\u5c0f\u63d0\u793a" class="vm" src="' + IMGDIR + '/info_small.gif"> \u5feb\u901f\u4e66\u5199\u8868\u683c\u63d0\u793a</p>', o += "<div id=\"tbltips_msg\" style=\"display: none\">\u201c[tr=\u989c\u8272]\u201d \u5b9a\u4e49\u884c\u80cc\u666f<br />\u201c[td=\u5bbd\u5ea6]\u201d \u5b9a\u4e49\u5217\u5bbd<br />\u201c[td=\u5217\u8de8\u5ea6,\u884c\u8de8\u5ea6,\u5bbd\u5ea6]\u201d \u5b9a\u4e49\u884c\u5217\u8de8\u5ea6<br /><br />\u5feb\u901f\u4e66\u5199\u8868\u683c\u8303\u4f8b\uff1a<div class='xs0' style='margin:0 5px'>[table]<br />Name:|Discuz!<br />Version:|X1<br />[/table]</div>\u7528\u201c|\u201d\u5206\u9694\u6bcf\u4e00\u5217\uff0c\u8868\u683c\u4e2d\u5982\u6709\u201c|\u201d\u7528\u201c\\|\u201d\u4ee3\u66ff\uff0c\u6362\u884c\u7528\u201c\\n\u201d\u4ee3\u66ff\u3002</div>"
                }
                w =
                document.createElement("div");
                w.id = q + "_menu";
                w.style.display = "none";
                w.className = "p_pof upf";
                w.style.width = "270px";
                "00" == C ? (w.className = "fwinmask", s = '<table width="100%" cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr><tr><td class="m_l">&nbsp;&nbsp;</td><td class="m_c"><h3 class="flb"><em></em><span><a onclick="javascript:$.oFEditor(\'' + f.id + '\').hideMenu(\'\', \'win\');return false;" class="flbc" href="javascript:;">X</a></span></h3><div class="c">' +
                    o + '</div><p class="o pns"><button type="submit" id="' + q + '_submit" class="pn pnc"><strong>\u63d0\u4ea4</strong></button></p></td><td class="m_r"></td></tr><tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>') : s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="javascript:$.oFEditor(\'' + f.id + '\').hideMenu();return false;" class="flbc" href="javascript:;">X</a></span><div>' + o + '</div><div class="pns mtn"><button type="submit" id="' + q + '_submit" class="pn pnc"><strong>\u63d0\u4ea4</strong></button></div></div>';
                w.innerHTML = s;
                a("body").append(w);
                showMenu({
                    ctrlid: q,
                    mtype: "menu",
                    evt: "click",
                    duration: 3,
                    cache: 0,
                    drag: 1,
                    pos: C
                })
            }
            try {
                E(q + "_param_1") && E(q + "_param_1").focus()
            } catch (y) {}
            f = w.getElementsByTagName("*");
            for (l = 0; l < f.length; l++) _attachEvent(f[l], "keydown", function (a) {
                a = a ? a : event;
                obj = BROWSER.ie ? event.srcElement : a.target;
                if (obj.type == "text" && a.keyCode == 13 || obj.type == "textarea" && a.ctrlKey && a.keyCode == 13) {
                    E(q + "_submit") && b != "image" && E(q + "_submit").click();
                    doane(a)
                } else if (a.keyCode == 27) {
                    hideMenu();
                    doane(a)
                }
            });
                E(q + "_submit") && (E(q + "_submit").onclick = function () {
                    d.checkFocus();
                    BROWSER.ie && j && d.setCaret(D[0]);
                    switch (b) {
                        case "url":
                        var a = E(q + "_param_1").value,
                        a = (isEmail(a) ? "mailto:" : "") + a;
                        if (a != "") {
                            var f = p ? p : E(q + "_param_2").value ? E(q + "_param_2").value : a;
                            o = j ? '<a href="' + a + '">' + f + "</a>" : "[url=" + squarestrip(a) + "]" + f + "[/url]";
                            j ? d.insertText(o, o.length - f.length, 0, p ? true : false, m) : d.insertText(o, o.length - f.length - 6, 6, p ? true : false, m)
                        }
                        break;
                        case "code":
                        if (j) {
                            v = '<div class="blockcode"><blockquote>';
                            x = "</blockquote></div><br />";
                            BROWSER.ie || (p = p ? p : "\n")
                        }
                        case "quote":
                        if (j && b == "quote") {
                            v = '<div class="quote"><blockquote>';
                            x = "</blockquote></div><br />";
                            BROWSER.ie || (p = p ? p : "\n")
                        }
                        case "tbl":
                        var a = E(q + "_param_1").value,
                        f = E(q + "_param_2").value,
                        k = E(q + "_param_3").value,
                        l = E(q + "_param_4").value,
                        a = /^[-\+]?\d+$/.test(a) && a > 0 && a <= 30 ? a : 2,
                        f = /^[-\+]?\d+$/.test(f) && f > 0 && f <= 30 ? f : 2,
                        k = k.substr(k.length - 1, k.length) == "%" ? k.substr(0, k.length - 1) <= 98 ? k : "98%" : k <= 560 ? k + "px" : "98%",
                        l = /[\(\)%,#\w]+/.test(l) ? l : "";
                        if (j) {
                            o = '<table cellspacing="0" cellpadding="0" style="width:' +
                            (k ? k : "50%") + '" class="t_table"' + (l ? ' bgcolor="' + l + '"' : "") + ">";
                            for (k = 0; k < a; k++) {
                                o = o + "<tr>\n";
                                for (col = 0; col < f; col++) o = o + "<td>&nbsp;</td>\n";
                                    o = o + "</tr>\n"
                            }
                            o = o + "</table>\n"
                        } else {
                            o = "[table=" + (k ? k : "50%") + (l ? "," + l : "") + "]\n";
                            for (k = 0; k < a; k++) {
                                o = o + "[tr]";
                                for (col = 0; col < f; col++) o = o + "[td] [/td]";
                                    o = o + "[/tr]\n"
                            }
                            o = o + "[/table]\n"
                        }
                        d.insertText(o, o.length, 0, false, m);
                        break;
                        default:
                        if (!o) {
                            o = "";
                            a = E(q + "_param_1").value;
                            if (E(q + "_param_2")) f = E(q + "_param_2").value;
                            if (E(q + "_param_3")) k = E(q + "_param_3").value;
                            if (c == 1 && a || c ==
                                2 && a && (haveSel || f) || c == 3 && a && f && (haveSel || k)) {
                                if (c == 1) o = a;
                            else if (c == 2) {
                                o = haveSel ? p : f;
                                v = "[" + b + "=" + a + "]"
                            } else {
                                o = haveSel ? p : k;
                                v = "[" + b + "=" + a + "," + f + "]"
                            }
                            d.insertText(v + o + x, strlen(v), strlen(x), true, m)
                        }
                    }
                }
                hideMenu()
            })
},
switchEditor: function (a) {
    var b = this.config,
    c = b.editorid;
    if (a != this.wysiwyg) {
        if (!a) {
            for (var d = [], f = E(c + "_controls").getElementsByTagName("a"), j = f.length, m = 0; m < j; m++) f[m].id && (d[d.length] = f[m].id);
                f = d.length;
            for (m = 0; m < f; m++) j = E(d[m]), -1 != j.id.indexOf(c + "_") ? (j.state = !1, j.mode = "normal") : -1 != j.id.indexOf(c +
                "_popup_") && (j.state = !1);
                this.setContext("clear")
        }
        this.cursor = -1;
        this.stack = [];
        c = this.getEditorContents();
        c = a ? bbcode2html(c) : html2bbcode(c);
        this.wysiwyg = a;
        b.initialtext = c;
        this.textobj.setAttribute("data-wysiwyg", a);
        this._createHTML();
        this.setEditorStyle();
        this.editwin.focus();
        this.setCaretAtEnd()
    }
},
hideMenu: function (a, b) {
    hideMenu(a, b)
},
getSubmitValue: function () {
    return html2bbcode(this.getEditorContents())
},
autoTypeset: function () {
    var a;
    BROWSER.ie && (a = this.wysiwyg ? this.editdoc.selection.createRange() :
        document.selection.createRange());
    var b = a ? this.wysiwyg ? a.htmlText.replace(/<\/?p>/ig, "<br />") : a.text : this.getSel(),
    b = trim(b),
    b = this.wysiwyg ? b.replace(/<br( \/)?>(<br( \/)?>)+/ig, '</p>\n<p style="line-height: 30px; text-indent: 2em;">') : b.replace(/\n\n+/g, "[/p]\n[p=30, 2, left]");
    opentag = this.wysiwyg ? '<p style="line-height: 30px; text-indent: 2em;">' : "[p=30, 2, left]";
    this.insertText(opentag + b + (this.wysiwyg ? "</p>" : "[/p]"), strlen(opentag), 4, !1, a);
    this.hideMenu()
},
getSel: function () {
    if (this.wysiwyg) try {
        return selection =
        this.editwin.getSelection(), this.checkFocus(), b = selection ? selection.getRangeAt(0) : this.editdoc.createRange(), this.readNodes(b.cloneContents(), !1)
    } catch (a) {
        try {
            var b = this.editdoc.selection.createRange();
            if (b.htmlText && b.text) return b.htmlText;
            for (var c = "", d = 0; d < b.length; d++) c += b.item(d).outerHTML;
                return c
        } catch (f) {
            return ""
        }
    } else return isUndefined(this.editdoc.selectionStart) ? document.selection && document.selection.createRange ? document.selection.createRange().text : window.getSelection ? window.getSelection() +
    "" : !1 : this.editdoc.value.substr(this.editdoc.selectionStart, this.editdoc.selectionEnd - this.editdoc.selectionStart)
},
insertText: function (a, b, c, d, f) {
    var j = this.editdoc,
    m = this.editbox;
    this.checkFocus();
    if (this.wysiwyg) try {
        this.editdoc.execCommand("insertHTML", !1, a)
    } catch (p) {
        if (!isUndefined(this.editdoc.selection) && ("Text" != this.editdoc.selection.type && "None" != this.editdoc.selection.type) && (b = !1, this.editdoc.selection.clear()), isUndefined(f) && (f = this.editdoc.selection.createRange()), f.pasteHTML(a), -1 ==
            a.indexOf("\n")) isUndefined(b) ? !1 != b && f.moveStart("character", -strlen(a)) : (f.moveStart("character", -strlen(a) + b), f.moveEnd("character", -c)), !isUndefined(d) && d && f.select()
    } else isUndefined(j.selectionStart) ? document.selection && document.selection.createRange ? (isUndefined(f) && (f = document.selection.createRange()), m.sel && (f = m.sel, m.sel = null), f.text = a.replace(/\r?\n/g, "\r\n"), isUndefined(b) ? !1 !== b && f.moveStart("character", -strlen(a)) : (f.moveStart("character", -strlen(a) + b), f.moveEnd("character", -c)), f.select()) :
j.value += a : (j._selectionStart && (j.selectionStart = j._selectionStart, j.selectionEnd = j._selectionEnd, j._selectionStart = 0, j._selectionEnd = 0), d = j.selectionStart + 0, j.value = j.value.substr(0, j.selectionStart) + a + j.value.substr(j.selectionEnd), isUndefined(b)) ? !1 !== b && (j.selectionStart = d, j.selectionEnd = d + strlen(a)) : (j.selectionStart = d + b, j.selectionEnd = d + strlen(a) - c);
this.checkFocus()
},
stripSimple: function (a, b, c) {
    var d = "[" + a + "]",
    a = "[/" + a + "]";
    for (isUndefined(c) && (c = -1); !1 !== (startindex = stripos(b, d)) && 0 != c;)
        if (c--, !1 !== (stopindex = stripos(b, a))) var f = b.substr(startindex + d.length, stopindex - startindex - d.length),
            b = b.substr(0, startindex) + f + b.substr(stopindex + a.length);
        else break;
        return b
    },
    stripComplex: function (a, b, c) {
        var d = "[" + a + "=",
        a = "[/" + a + "]";
        for (isUndefined(c) && (c = -1); !1 !== (startindex = stripos(b, d)) && 0 != c;)
            if (c--, !1 !== (stopindex = stripos(b, a))) {
                var f = stripos(b, "]", startindex);
                if (!1 !== f && f > startindex && f < stopindex) f = b.substr(f + 1, stopindex - f - 1), b = b.substr(0, startindex) + f + b.substr(stopindex + a.length);
                else break
            } else break;
        return b
    },
    stripos: function (a, b, c) {
        isUndefined(c) && (c = 0);
        a = a.toLowerCase().indexOf(b.toLowerCase(), c);
        return -1 == a ? !1 : a
    },
    readNodes: function (a, b) {
        var c = "",
        d = /_moz/i;
        switch (a.nodeType) {
            case Node.ELEMENT_NODE:
            case Node.DOCUMENT_FRAGMENT_NODE:
            var f;
            if (b) {
                f = !a.hasChildNodes();
                for (var c = "<" + a.tagName.toLowerCase(), j = a.attributes, m = 0; m < j.length; ++m) {
                    var p = j.item(m);
                    p.specified && (!p.name.match(d) && !p.value.match(d)) && (c += " " + p.name.toLowerCase() + '="' + p.value + '"')
                }
                c += f ? " />" : ">"
            }
            for (m = a.firstChild; m; m = m.nextSibling) c +=
                readNodes(m, !0);
            b && !f && (c += "</" + a.tagName.toLowerCase() + ">");
            break;
            case Node.TEXT_NODE:
            c = htmlspecialchars(a.data)
        }
        return c
    },
    getCaret: function () {
        if (this.wysiwyg) {
            var a = this.editdoc.body,
            b = document.selection.createRange();
            b.setEndPoint("StartToStart", a.createTextRange());
            var a = b.htmlText.match(/<\/p>/ig),
            c = b.htmlText.match(/<br[^\>]*>/ig),
            a = (a ? a.length - 1 : 0) + (c ? c.length : 0),
            c = b.text.replace(/\r?\n/g, " ").length;
            if (matches3 = b.htmlText.match(/<img[^\>]*>/ig)) c += matches3.length;
            if (matches4 = b.htmlText.match(/<\/tr|table>/ig)) c +=
                matches4.length;
            return [c, a]
        }
        this.checkFocus();
        this.editbox.sel = document.selection.createRange();
        this.editdoc._selectionStart = this.editdoc.selectionStart;
        this.editdoc._selectionEnd = this.editdoc.selectionEnd
    },
    setCaret: function (a) {
        var b = (this.wysiwyg ? this.editdoc.body : this.editbox).createTextRange();
        b.moveStart("character", a);
        b.collapse(!0);
        b.select()
    },
    showColorBox: function (b, c, d, f) {
        d = this.config;
        f = !f ? "forecolor" : "backcolor";
        this.checkFocus();
        if (!E(b + "_menu")) {
            var l = document.createElement("div");
            l.id =
            b + "_menu";
            l.className = "p_pop colorbox";
            l.unselectable = !0;
            l.style.display = "none";
            for (var j = "Black Sienna DarkOliveGreen DarkGreen DarkSlateBlue Navy Indigo DarkSlateGray DarkRed DarkOrange Olive Green Teal Blue SlateGray DimGray Red SandyBrown YellowGreen SeaGreen MediumTurquoise RoyalBlue Purple Gray Magenta Orange Yellow Lime Cyan DeepSkyBlue DarkOrchid Silver Pink Wheat LemonChiffon PaleGreen PaleTurquoise LightBlue Plum White".split(" "), m = "\u9ed1\u8272 \u8d6d\u8272 \u6697\u6a44\u6984\u7eff\u8272 \u6697\u7eff\u8272 \u6697\u7070\u84dd\u8272 \u6d77\u519b\u8272 \u975b\u9752\u8272 \u58a8\u7eff\u8272 \u6697\u7ea2\u8272 \u6697\u6854\u9ec4\u8272 \u6a44\u6984\u8272 \u7eff\u8272 \u6c34\u9e2d\u8272 \u84dd\u8272 \u7070\u77f3\u8272 \u6697\u7070\u8272 \u7ea2\u8272 \u6c99\u8910\u8272 \u9ec4\u7eff\u8272 \u6d77\u7eff\u8272 \u95f4\u7eff\u5b9d\u77f3 \u7687\u5bb6\u84dd \u7d2b\u8272 \u7070\u8272 \u7ea2\u7d2b\u8272 \u6a59\u8272 \u9ec4\u8272 \u9178\u6a59\u8272 \u9752\u8272 \u6df1\u5929\u84dd\u8272 \u6697\u7d2b\u8272 \u94f6\u8272 \u7c89\u8272 \u6d45\u9ec4\u8272 \u67e0\u6aac\u7ef8\u8272 \u82cd\u7eff\u8272 \u82cd\u5b9d\u77f3\u7eff \u4eae\u84dd\u8272 \u6d0b\u674e\u8272 \u767d\u8272".split(" "),
                p = "", o = 0; 40 > o; o++) p += '<input type="button" style="background-color: ' + j[o] + '" onmouseover="javascript:$.oFEditor(\'' + d.id + "').setEditorTip('" + m[o] + "')\" onmouseout=\"javascript:$.oFEditor('" + d.id + "').setEditorTip('')\" onclick=\"javascript:$.oFEditor('" + d.id + "').puzzcode('" + f + "', '" + j[o] + '\');" title="' + m[o] + '" />' + (39 > o && 0 == (o + 1) % 8 ? "<br />" : "");
l.innerHTML = p;
a("body").append(l)
}
showMenu({
    ctrlid: b,
    evt: "click",
    layer: c
})
},
showSmiles: function (b, c) {
    var d = this.config;
    if (E(b + "_menu")) showMenu({
        ctrlid: b,
        evt: "click",
        layer: c
    });
        else {
            var f = a("#data-actions");
            ajaxpost(f.attr("data-smiles-url"), {}, function (f) {
                var f = Mustache.render('{{#data}}<a href="javascript:;" onclick="javascript:$.oFEditor(\'' + d.id + '\').insertSmiley({{smile_id}});"><img id="smilie_{{smile_id}}" src="' + base_url + 'assets/img/smiles/default/{{url}}" alt="{{code}}"/></a>{{/data}}', f),
                k = document.createElement("div");
                k.id = b + "_menu";
                k.className = "p_pop smilebox";
                k.unselectable = !0;
                k.style.display = "none";
                k.innerHTML = f;
                a("body").append(k);
                showMenu({
                    ctrlid: b,
                    evt: "click",
                    layer: c
                })
            }, function (a) {
                showError(a.message)
            })
        }
    },
    insertSmiley: function (a) {
        var b = this.wysiwyg;
        this.checkFocus();
        var c = E("smilie_" + a).src,
        d = E("smilie_" + a).alt;
        b ? this.insertText('<img src="' + c + '" border="0" smilieid="' + a + '" alt="" />', !1) : (d += " ", this.insertText(d, strlen(d), 0));
        hideMenu()
    },
    showFontSizeList: function (b, c) {
        var d = this.config;
        if (!E(b + "_menu")) {
            var f = document.createElement("div");
            f.id = b + "_menu";
            f.className = "p_pop fszm";
            f.unselectable = !0;
            f.style.display = "none";
            for (var l = '<ul unselectable="on">',
                j = 1; 8 > j; j++) l += "<li onclick=\"javascript:$.oFEditor('" + d.id + "').puzzcode('fontsize', '" + j + '\')" unselectable="on"><a href="javascript:;" title="' + j + '"><font size="' + j + '" unselectable="on">' + j + "</a></li>";
                f.innerHTML = l + "</ul>";
            a("body").append(f)
        }
        showMenu({
            ctrlid: b,
            evt: "click",
            layer: c
        })
    },
    ctlent: function (a) {
        var b = this.wysiwyg,
        c = {
            8: 1,
            9: 1,
            13: 1
        };
        c[9] && 9 == a.keyCode && doane(a);
        if (c[8] && (8 == a.keyCode && b) && (b = this.getSel())) this.insertText("", b.length - 1, 0), doane(a)
    },
showFontList: function (b, c) {
    var d = this.config;
    if (!E(b + "_menu")) {
        var f = document.createElement("div");
        f.id = b + "_menu";
        f.className = "p_pop fnm";
        f.unselectable = !0;
        f.style.display = "none";
        var l = '<ul unselectable="on">',
        j = "\u5b8b\u4f53;\u9ed1\u4f53;\u5fae\u8f6f\u96c5\u9ed1;Arial;Verdana;simsun;Helvetica;Trebuchet MS;Tahoma;Impact;Times New Roman;\u4eff\u5b8b,\u4eff\u5b8b_GB2312;\u6977\u4f53,\u6977\u4f53_GB2312".split(";");
        for (i in j) l += "<li onclick=\"javascript:$.oFEditor('" + d.id + "').puzzcode('fontname', '" + j[i] + '\')" style="font-family: ' + j[i] + '" unselectable="on"><a href="javascript:;" title="' +
            j[i] + '">' + j[i] + "</a></li>";
        f.innerHTML = l + "</ul>";
        a("body").append(f)
    }
    showMenu({
        ctrlid: b,
        evt: "click",
        layer: c
    })
},
_createHTML: function () {
    var a = this.config;
    this.cursor = -1;
    this.stack = [];
    this.initialized = !1;
    this.textobj = E(a.editorid + "_textarea");
    this.wysiwyg = this.textobj.getAttribute("data-wysiwyg");
    this.postminchars = this.textobj.getAttribute("data-postminchars");
    this.postmaxchars = this.textobj.getAttribute("data-postmaxchars");
    this.allowswitcheditor = this.textobj.getAttribute("data-allowswitcheditor");
    this.allowsmilies =
    this.textobj.getAttribute("data-allowsmilies");
    this.allowbbcode = this.textobj.getAttribute("data-allowbbcode");
    this.allowimgcode = this.textobj.getAttribute("data-allowimgcode");
    if (1 == this.wysiwyg) {
        if (E(a.editorid + "_iframe")) this.editbox = E(a.editorid + "_iframe");
        else {
            var b = document.createElement("iframe");
            b.frameBorder = "0";
            b.tabIndex = 2;
            b.hideFocus = !0;
            b.style.display = "none";
            this.editbox = this.textobj.parentNode.appendChild(b);
            this.editbox.id = a.editorid + "_iframe"
        }
        this.editwin = this.editbox.contentWindow;
        this.editdoc = this.editwin.document;
        this.writeEditorContents(!a.initialtext || "" == a.initialtext ? this.textobj.value : a.initialtext)
    } else this.wysiwyg = !1, this.editbox = this.editwin = this.editdoc = this.textobj, a.initialtext && this.writeEditorContents(a.initialtext), this.addSnapshot(this.textobj.value);
    this.setEditorEvents();
    this.initEditor()
}
})
})(jQuery);
(function () {
    function a(a, b, c) {
        if (a.addEventListener) a.addEventListener(b, c, !1);
        else if (a.attachEvent) a.attachEvent("on" + b, function () {
            c.call(a)
        });
            else throw Error("not supported or DOM not loaded");
        }

        function b(a, b) {
            for (var c in b) b.hasOwnProperty(c) && (a.style[c] = b[c])
        }

    function c(a, b) {
        RegExp("\\b" + b + "\\b").test(a.className) || (a.className += " " + b)
    }

    function d(a, b) {
        a.className = a.className.replace(RegExp("\\b" + b + "\\b"), "")
    }

    function f(a) {
        a.parentNode.removeChild(a)
    }
    var g = document.documentElement.getBoundingClientRect ?
    function (a) {
        var b = a.getBoundingClientRect(),
        c = a.ownerDocument,
        a = c.body,
        c = c.documentElement,
        d = c.clientTop || a.clientTop || 0,
        f = c.clientLeft || a.clientLeft || 0,
        g = 1;
        a.getBoundingClientRect && (g = a.getBoundingClientRect(), g = (g.right - g.left) / a.clientWidth);
        1 < g && (f = d = 0);
        return {
            top: b.top / g + (window.pageYOffset || c && c.scrollTop / g || a.scrollTop / g) - d,
            left: b.left / g + (window.pageXOffset || c && c.scrollLeft / g || a.scrollLeft / g) - f
        }
    } : function (a) {
        var b = 0,
        c = 0;
        do b += a.offsetTop || 0, c += a.offsetLeft || 0, a = a.offsetParent; while (a);
        return {
            left: c,
            top: b
        }
    }, h = function () {
        var a = document.createElement("div");
        return function (b) {
            a.innerHTML = b;
            return a.removeChild(a.firstChild)
        }
    }(),
    n = function () {
        var a = 0;
        return function () {
            return "ValumsAjaxUpload" + a++
        }
    }();
    window.AjaxUpload = function (b, c) {
        this._settings = {
            action: "upload.php",
            name: "userfile",
            multiple: !1,
            data: {},
            autoSubmit: !0,
            responseType: !1,
            hoverClass: "hover",
            focusClass: "focus",
            disabledClass: "disabled",
            onChange: function () {},
            onSubmit: function () {},
            onComplete: function () {}
        };
        for (var d in c) c.hasOwnProperty(d) &&
            (this._settings[d] = c[d]);
        b.jquery ? b = b[0] : "string" == typeof b && (/^#.*/.test(b) && (b = b.slice(1)), b = document.getElementById(b));
        if (!b || 1 !== b.nodeType) throw Error("Please make sure that you're passing a valid element");
        "A" == b.nodeName.toUpperCase() && a(b, "click", function (a) {
            if (a && a.preventDefault) a.preventDefault();
            else if (window.event) window.event.returnValue = false
        });
        this._button = b;
        this._input = null;
        this._disabled = !1;
        this.enable();
        this._rerouteClicks()
    };
    AjaxUpload.prototype = {
        setData: function (a) {
            this._settings.data =
            a
        },
        disable: function () {
            c(this._button, this._settings.disabledClass);
            this._disabled = !0;
            var a = this._button.nodeName.toUpperCase();
            ("INPUT" == a || "BUTTON" == a) && this._button.setAttribute("disabled", "disabled");
            this._input && this._input.parentNode && (this._input.parentNode.style.visibility = "hidden")
        },
        enable: function () {
            d(this._button, this._settings.disabledClass);
            this._button.removeAttribute("disabled");
            this._disabled = !1
        },
        _createInput: function () {
            var f = this,
            g = document.createElement("input");
            g.setAttribute("type",
                "file");
            g.setAttribute("name", this._settings.name);
            this._settings.multiple && g.setAttribute("multiple", "multiple");
            b(g, {
                position: "absolute",
                right: 0,
                margin: 0,
                padding: 0,
                fontSize: "480px",
                fontFamily: "sans-serif",
                cursor: "pointer"
            });
            var j = document.createElement("div");
            b(j, {
                display: "block",
                position: "absolute",
                overflow: "hidden",
                margin: 0,
                padding: 0,
                opacity: 0,
                direction: "ltr",
                zIndex: 2147483583
            });
            if ("0" !== j.style.opacity) {
                if ("undefined" == typeof j.filters) throw Error("Opacity not supported by the browser");
                j.style.filter =
                "alpha(opacity=0)"
            }
            a(g, "change", function () {
                if (g && "" !== g.value) {
                    var a = g.value.replace(/.*(\/|\\)/, "");
                    !1 === f._settings.onChange.call(f, a, -1 !== a.indexOf(".") ? a.replace(/.*[.]/, "") : "") ? f._clearInput() : f._settings.autoSubmit && f.submit()
                }
            });
            a(g, "mouseover", function () {
                c(f._button, f._settings.hoverClass)
            });
            a(g, "mouseout", function () {
                d(f._button, f._settings.hoverClass);
                d(f._button, f._settings.focusClass);
                g.parentNode && (g.parentNode.style.visibility = "hidden")
            });
            a(g, "focus", function () {
                c(f._button, f._settings.focusClass)
            });
            a(g, "blur", function () {
                d(f._button, f._settings.focusClass)
            });
            j.appendChild(g);
            document.body.appendChild(j);
            this._input = g
        },
        _clearInput: function () {
            this._input && (f(this._input.parentNode), this._input = null, this._createInput(), d(this._button, this._settings.hoverClass), d(this._button, this._settings.focusClass))
        },
        _rerouteClicks: function () {
            var c = this;
            a(c._button, "mouseover", function () {
                var a;
                if (!c._disabled) {
                    c._input || c._createInput();
                    var d = c._input.parentNode,
                    f = c._button,
                    h;
                    a = g(f);
                    h = a.left;
                    a = a.top;
                    b(d, {
                        position: "absolute",
                        left: h + "px",
                        top: a + "px",
                        width: f.offsetWidth + "px",
                        height: f.offsetHeight + "px"
                    });
                    d.style.visibility = "visible"
                }
            })
        },
        _createIframe: function () {
            var a = n(),
            b = h('<iframe src="javascript:false;" name="' + a + '" />');
            b.setAttribute("id", a);
            b.style.display = "none";
            document.body.appendChild(b);
            return b
        },
        _createForm: function (a) {
            var b = this._settings,
            c = h('<form method="post" enctype="multipart/form-data"></form>');
            c.setAttribute("action", b.action);
            c.setAttribute("target", a.name);
            c.style.display = "none";
            document.body.appendChild(c);
            for (var d in b.data) b.data.hasOwnProperty(d) && (a = document.createElement("input"), a.setAttribute("type", "hidden"), a.setAttribute("name", d), a.setAttribute("value", b.data[d]), c.appendChild(a));
                return c
        },
        _getResponse: function (b, c) {
            var d = !1,
            g = this,
            h = this._settings;
            a(b, "load", function () {
                if ("javascript:'%3Chtml%3E%3C/html%3E';" == b.src || "javascript:'<html></html>';" == b.src) d && setTimeout(function () {
                    f(b)
                }, 0);
                else {
                    var a = b.contentDocument ? b.contentDocument : window.frames[b.id].document;
                    if (!(a.readyState && "complete" !=
                        a.readyState) && !(a.body && "false" == a.body.innerHTML)) {
                        var n;
                    a.XMLDocument ? n = a.XMLDocument : a.body ? (n = a.body.innerHTML, h.responseType && "json" == h.responseType.toLowerCase() && (a.body.firstChild && "PRE" == a.body.firstChild.nodeName.toUpperCase() && (a.normalize(), n = a.body.firstChild.firstChild.nodeValue), n = n ? eval("(" + n + ")") : {})) : n = a;
                    h.onComplete.call(g, c, n);
                    d = !0;
                    b.src = "javascript:'<html></html>';"
                }
            }
        })
},
submit: function () {
    var a = this._settings;
    if (this._input && "" !== this._input.value) {
        var b = this._input.value.replace(/.*(\/|\\)/,
            "");
        if (!1 === a.onSubmit.call(this, b, -1 !== b.indexOf(".") ? b.replace(/.*[.]/, "") : "")) this._clearInput();
        else {
            var a = this._createIframe(),
            c = this._createForm(a);
            f(this._input.parentNode);
            d(this._button, this._settings.hoverClass);
            d(this._button, this._settings.focusClass);
            c.appendChild(this._input);
            c.submit();
            f(c);
            f(this._input);
            this._input = null;
            this._getResponse(a, b);
            this._createInput()
        }
    }
}
}
})();
$(document).ready(function (a) {
    (function (a) {
        a.oValidate = function (r) {
            var M = {  // 打*代表已知现在有用到的,没用的以后可以删掉
                reset_password_form: c,
                forget_password_from: d,
                send_message_form: f,
                create_group_form: l,
                update_group_form: j,
                create_topic_form: n,
                update_topic_form: k,
                create_album_form: create_album_form, // *
                album_edit_form: album_edit_form, // *
                create_board_form: board_form, // *
                update_album_form: h,
                save_share_form: save_share_form,
                web_pin_form: web_pin_form,  // *
                register_form: C,
                social_register_form: y,
                update_userinfo: update_userinfo,
                update_password_form: x,
                edit_share_form: edit_share_form,
                edit_item_form: edit_item_form, // *
                forwarding_item_form : forwarding_item_form, // *
                update_goodshop_form: o,
                setting_forum_form: v,
                login_form: w,
                bbs_login_form: D,
                user_login_form: User
            };
            r && (M[r] && a("#" + r)) && a("#" + r).validate(M[r])
        };
        var c = {
            rules: {
                new_passwd: {
                    required: !0,
                    rangelength: [6, 15]
                },
                new_verify_passwd: {
                    required: !0,
                    rangelength: [6, 15],
                    equalTo: "#new_passwd"
                }
            },
            messages: {
                new_passwd: {
                    required: getTip("required-field"),
                    rangelength: getTip("password_not_valid")
                },
                new_verify_passwd: {
                    required: getTip("required-field"),
                    rangelength: getTip("password_not_valid"),
                    equalTo: getTip("password_not_match")
                }
            },
            submitHandler: function () {
                a("#reset_password_form").ajaxSubmit({
                    url: a("#data-actions").attr("data-resetpassword-url"),
                    data: a("#reset_password_form").formSerialize(),
                    type: "POST",
                    dataType: "json",
                    beforeSubmit: function () {
                        show_message("info", getTip("loading-detail"), !1, 0)
                    },
                    success: function (a) {
                        !0 === a.success ? (show_message("success", a.message, !0, 2E3), setTimeout(function () {
                            window.location.href = a.data.redirect_url
                        }, 2E3)) : show_message("error", a.message, !1, 0)
                    },
                    error: function (a) {
                        show_message("error", a, !1, 0)
                    }
                });
                return !1
            }
        }, d = {
            rules: {
                email: {
                    required: !0,
                    email: !0
                }
            },
            messages: {
                email: {
                    required: getTip("required-field"),
                    email: getTip("not_valid")
                }
            },
            submitHandler: function () {
                a("#forget_password_from").ajaxSubmit({
                    url: a("#data-actions").attr("data-forgetpassword-url"),
                    data: a("#forget_password_from").formSerialize(),
                    type: "POST",
                    dataType: "json",
                    beforeSubmit: function () {
                        show_message("info", getTip("loading-detail"), !1, 0)
                    },
                    success: function (a) {
                        !0 === a.success ? (show_message("success", a.message, !0, 2E3), setTimeout(function () {
                            window.location.href = a.data.redirect_url
                        }, 2E3)) : show_message("error", a.message, !1, 0)
                    },
                    error: function (a) {
                        show_message("error", a, !1, 0)
                    }
                });
                return !1
            }
        }, f = {
            rules: {
                message_user: {
                    required: !0
                },
                message_content: {
                    byteRangeLength: [0, 300]
                }
            },
            messages: {
                message_user: {
                    required: getTip("required-field")
                }
            },
            submitHandler: function () {
                a("#send_message_form").ajaxSubmit({
                    url: a("#data-actions").attr("data-sendmessage-url"),
                    data: a("#send_message_form").formSerialize(),
                    type: "POST",
                    dataType: "json",
                    beforeSubmit: function () {
                        show_message("info", getTip("loading-detail"), !1, 0)
                    },
                    success: function (a) {
                        !0 === a.success ? (show_message("success", a.message, !0, 2E3), getStaticDialog().hide()) : show_message("error", a.message, !1, 0)
                    },
                    error: function () {
                        show_message("error", data, !1, 0)
                    }
                });
                return !1
            }
        }, create_album_form = {
            rules: {
                album_title: {
                    required: !0,
                    byteRangeLength: [3, 50]
                },
                album_desc: {
                    byteRangeLength: [0, 300]
                }
            },
            messages: {
                album_title: {
                    required: getTip("required-field")
                }
            },
            submitHandler: function () {
                a("#create_album_form").ajaxSubmit({
                    url: a("#data-actions").attr("data-ajax-albumcreate"),
                    data: a("#create_album_form").formSerialize(),
                    type: "POST",
                    dataType: "json",
                    beforeSubmit: function () {
                        $('.submit_div').html('创建中...');
                    },
                    success: function (a) {
                        !0 === a.success ? (show_message("success", getTip("success") + ": " + a.message, !1, 0), setTimeout(function () {
                            getStaticDialog().hide();
                        }, 2E3)) : show_message("error", getTip("error") + ": " + a.message, !1, 0)
                    },
                    error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
                return !1
            }
        },album_edit_form = {
            rules: {
                album_title: {
                    required: !0,
                    byteRangeLength: [3, 50]
                },
                album_desc: {
                    byteRangeLength: [0, 300]
                }
            },
            messages: {
                album_title: {
                    required: getTip("required-field")
                }
            },
            submitHandler: function () {
                a("#album_edit_form").ajaxSubmit({
                    url: a("#data-actions").attr("data-updateAlbum-url"),
                    data: a("#album_edit_form").formSerialize(),
                    type: "POST",
                    dataType: "json",
                    success: function (a) {
                        !0 === a.success ? (show_message("success",a.message, !1, 0), setTimeout(function () {
                            window.location.reload()
                        }, 2E3)) : show_message("error", getTip("error") + ": " + a.message, !1, 0)
                    },
                    error: function (a) {
                        showError(a.message);
                    }
                });
                return !1
            }
        },
        board_form = {
           rules: {
               board_title: {
                   required: !0,
                   byteRangeLength: [5, 50]
               },
               board_desc: {
                   byteRangeLength: [0, 300]
               }
           },
           messages: {
               board_title: {
                   required: getTip("required-field")
               }
           },
           submitHandler: function () {
               a("#create_board_form").ajaxSubmit({
                   url: a("#data-actions").attr("data-ajax-boardcreate"),
                   data: a("#create_board_form").formSerialize(),
                   type: "POST",
                   dataType: "json",
                   beforeSubmit: function () {
                       a("#ajax_message").html(getTip("loading-detail"))
                   },
                   success: function (c) {
                       !0 === c.success ? (a("#ajax_message").html(c.message), setTimeout(function () {
                           window.location.reload()
                       },
                       2E3)) : a("#ajax_message").html(c.message)
                   },
                   error: function () {
                             //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                         }
                     });
               return !1
           }
       },h = {
        rules: {
            album_title: {
                required: !0,
                byteRangeLength: [5, 50]
            },
            album_desc: {
                byteRangeLength: [0, 300]
            }
        },
        messages: {
            album_title: {
                required: getTip("required-field")
            }
        },
        submitHandler: function () {
            a("#update_album_form").ajaxSubmit({
                url: a("#data-actions").attr("data-updatealbum-url"),
                data: a("#update_album_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    a("#ajax_message").html(getTip("loading-detail"))
                },
                success: function (c) {
                    !0 === c.success ? (a("#ajax_message").html(c.message), setTimeout(function () {
                        window.location.reload()
                    }, 2E3)) : a("#ajax_message").html(c.message)
                },
                error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
            return !1
        }
    }, n = {
        rules: {
            topic_title: {
                required: !0,
                byteRangeLength: [5, 50]
            },
            topic_desc: {
                byteRangeLength: [0, 300]
            }
        },
        messages: {
            topic_title: {
                required: getTip("required-field")
            }
        },
        submitHandler: function () {
            a("#create_topic_form").ajaxSubmit({
                url: a("#data-actions").attr("data-create_topic-url"),
                data: a("#create_topic_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    a("#ajax_message").html(getTip("loading-detail"))
                },
                success: function (c) {
                    !0 === c.success ? (a("#ajax_message").html(c.message), window.location.href = a("#create_topic_form").attr("next-url")) : a("#ajax_message").html(c.message)
                },
                error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
            return !1
        }
    }, k = {
        rules: {
            topic_title: {
                required: !0,
                byteRangeLength: [5, 50]
            },
            topic_desc: {
                byteRangeLength: [0,
                300
                ]
            }
        },
        messages: {
            topic_title: {
                required: getTip("required-field")
            }
        },
        submitHandler: function () {
            a("#update_topic_form").ajaxSubmit({
                url: a("#data-actions").attr("data-update_topic-url"),
                data: a("#update_topic_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    a("#ajax_message").html(getTip("loading-detail"))
                },
                success: function (c) {
                    !0 === c.success ? (a("#ajax_message").html(c.message), window.location.href = a("#update_topic_form").attr("next-url")) : a("#ajax_message").html(c.message)
                },
                error: function () {
                     //       show_message("error",getTip("error") + ": " + getTip("server-error"), !1, 0)
                 }
             });
            return !1
        }
    }, l = {
        rules: {
            group_title: {
                required: !0,
                byteRangeLength: [5, 50]
            },
            group_desc: {
                byteRangeLength: [0, 300]
            }
        },
        messages: {
            group_title: {
                required: getTip("required-field")
            }
        },
        submitHandler: function () {
            a("#create_group_form").ajaxSubmit({
                url: a("#data-actions").attr("data-create_group-url"),
                data: a("#create_group_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    a("#ajax_message").html(getTip("loading-detail"))
                },
                success: function (c) {
                    !0 ===
                    c.success ? (a("#ajax_message").html(c.message), window.location.href = a("#create_group_form").attr("next-url")) : a("#ajax_message").html(c.message)
                },
                error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
            return !1
        }
    }, j = {
        rules: {
            group_title: {
                required: !0,
                byteRangeLength: [5, 50]
            },
            group_desc: {
                byteRangeLength: [0, 300]
            }
        },
        messages: {
            group_title: {
                required: getTip("required-field")
            }
        },
        submitHandler: function () {
            a("#update_group_form").ajaxSubmit({
                url: a("#data-actions").attr("data-update_group-url"),
                data: a("#update_group_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    a("#ajax_message").html(getTip("loading-detail"))
                },
                success: function (c) {
                    !0 === c.success ? (a("#ajax_message").html(c.message), window.location.href = a("#update_group_form").attr("next-url")) : a("#ajax_message").html(c.message)
                },
                error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
            return !1
        }
    }, save_share_form = {
        rules: {
            intro: {
                required: !0,
                byteRangeLength: [0, 300]
            }
        },
        messages: {

        },
        submitHandler: function () {
            var c = !1,
                d = [],
                f = a("#save_share_form #share_type").val(),
                img;
                // add by allen;
            if(f == 'web_fetch'){
                img = $('.thumbnail img').attr('src');
            }else if(f == 'upload'){
                img = $('.thumbnail img').attr('data-name');
            }
            // edit by porter at 2013-12-02 17:25:40
            else if(f == 'images'){
                img = $('.thumbnail img').attr('src');
            }
            d = [{url:img ,desc: "",cover: ""}];
            $("#save_share_form #all_files").val(serialize(d))
            $("#save_share_form #cover_filename").val(img);
            $("#save_share_form").ajaxSubmit({
                url: $("#save_share_form").attr("data-url"),
                data: $("#save_share_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    //防止本地上传表单重复提交
                    $('.submit_div').html('<span>发布中...</span>');
                },
                success: function (a) {
                    !0 === a.success ? (show_message("success", getTip("success") + ": " + a.message, !1, 0), setTimeout(function () {
                        window.location.reload()
                    }, 2E3)) : show_message("error", getTip("error") + ": " + a.message, !1, 0)
                },
                error: function () {
                    //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                }
            });
            return !1
        }
    }, web_pin_form = {
        rules: {
            intro: {
                required: !0,
                byteRangeLength: [0,300]
            }
        },
        messages: {
            intro: {
                required: "必填字段",
                byteRangeLength: "简介长度必须为0-300"
            }
        },
        submitHandler: function () {
            a("#web_pin_form").ajaxSubmit({
                url: a("#data-actions").attr("web-pin-url"),
                data: a("#web_pin_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    //防止表单重复提交
                    $('.submit_div').html('<span>发布中...</span>');
                },
                success: function (a) {
                    showDialog('fetch_success',function(){
                        $('#seeNow').attr('href',a.data);
                    });
                },
                error: function (a) {
                    showError(a.message);
                }
            });
            return !1
        }
    }, edit_share_form = {
        rules: {
            intro: {
                required: !0,
                byteRangeLength: [4,
                4E3
                ]
            },
            title: {
                required: !0,
                byteRangeLength: [4, 80]
            }
        },
        messages: {
            intro: {
                required: getTip("required-field"),
                byteRangeLength: getTip("intro_length_not_valid")
            },
            title: {
                required: getTip("required-field"),
                byteRangeLength: getTip("title_length_not_valid")
            }
        },
        submitHandler: function () {
            var c = [],
            d = !1;
            if ("article" != a("#edit_share_form #share_type").val()) {
                a("#publish_image_list li.selected").each(function () {
                    var f = a(this).find("input").val();
                    if (140 < str_length(f)) return a("#ajax_share_message").html(getTip("img_desc_not_valid")), !1;
                    a(this).hasClass("cover") ? (f = {
                        id: a(this).attr("data-id"),
                        url: a(this).attr("data-url"),
                        desc: f,
                        cover: !0
                    }, c.push(f), d = !0) : (f = {
                        id: a(this).attr("data-id"),
                        url: a(this).attr("data-url"),
                        desc: f,
                        cover: !1
                    }, c.push(f))
                });
                if (!d) return a("#ajax_share_message").html(getTip("no_img_cover_selected")), !1;
                a("#edit_share_form #all_files").val(serialize(c))
            }
            a("#edit_share_form #meditor_textarea").val(a.oFEditor("m_editor").getSubmitValue());
            a("#edit_share_form").ajaxSubmit({
                url: a("#data-actions").attr("data-editshare-url"),
                data: a("#edit_share_form").formSerialize(),
                type: "POST",
                dataType: "json",
                beforeSubmit: function () {
                    var c = a("#edit_share_form .album_select_id").val();
                    if (null == c || "" == c || 0 == c) return a("#ajax_share_message").html(getTip("album_cannot_be_null")), !1;
                    a("#ajax_share_message").html(getTip("loading-detail"))
                },
                success: function (c) {
                    !0 === c.success ? (a("#ajax_share_message").html(c.message), window.location.reload()) : a("#ajax_share_message").html(c.message)
                },
                error: function () {
                 //   show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                }
            });
            return !1
        }
    }, edit_item_form = {
    rules: {
        intro: {
            required: !0,
            byteRangeLength: [0,300]
        }
    },
    messages: {
        intro: {
            required: "必填字段",
            byteRangeLength: "长度为0-300"
        }
    },
    submitHandler: function () {
        a("#edit_item_form").ajaxSubmit({
            url: a("#data-actions").attr("update-share-url"),
            data: a("#edit_item_form").formSerialize(),
            type: "POST",
            dataType: "json",
            success: function (a) {
                showSuccess(a.message);
                getStaticDialog().hide();
            },
            error: function (a) {
                showError(a.message);
            }
        });
        return !1
    }
}, forwarding_item_form = {
   rules: {
    intro: {
        required: !0,
        byteRangeLength: [0,300]
    }
},
messages: {
    intro: {
        required: "必填字段",
        byteRangeLength: "长度为0-300"
    }
},
submitHandler: function () {
    a("#forwarding_item_form").ajaxSubmit({
        url: a("#data-actions").attr("data-forwarding-url"),
        data: a("#forwarding_item_form").formSerialize(),
        type: "POST",
        dataType: "json",
        success: function (a) {
            getStaticDialog().hide();
            showSuccess(a.message);
            check_message("reward", !0, 3E3, 1E3)
        },
        error: function (a) {
            showError(a.message)
        }
    });
    return !1
}
}, o = {
    rules: {
        store_name: {
            required: !0,
            byteRangeLength: [4, 20]
        },
        address: {
            required: !0,
            byteRangeLength: [4, 200]
        },
        shop_desc: {
            required: !0,
            byteRangeLength: [10, 300]
        }
    },
    messages: {
        store_name: {
            required: getTip("required-field")
        },
        address: {
            required: getTip("required-field")
        },
        shop_desc: {
            required: getTip("required-field"),
            byteRangeLength: getTip("gooshop_desc_not_valid")
        }
    },
    submitHandler: function () {
        a("#update_goodshop_form").ajaxSubmit({
            url: a("#data-actions").attr("data-editgoodshop-url"),
            data: a("#update_goodshop_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                a("#ajax_message").html(getTip("loading-detail"))
            },
            success: function (c) {
                !0 === c.success ? (a("#ajax_message").html(c.message), window.location.href = a("#update_goodshop_form").attr("next-url")) : a("#ajax_message").html(c.message)
            },
            error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
        return !1
    }
};
getTip("required-field");
getTip("gooshop_desc_not_valid");
var update_userinfo = {
    rules: {
        nickname: {
            required: !0,
            byteRangeLength: [4, 20],
            remote: function () {
                return a("#data-actions").attr("data-ajax-updatenickname")
            }
        },
        domain: {
            byteRangeLength: [0, 7],
            remote: function () {
                return a("#data-actions").attr("data-domaincheck-url")
            }
        }
    },
    messages: {
        nickname: {
            required: getTip("required-field"),
            byteRangeLength: getTip("nick_not_valid"),
            remote: getTip("nick_already_existed")
        },
        domain: {
            remote: getTip("already_existed")
        }
    },
    submitHandler: function () {
        a("#update_userinfo").ajaxSubmit({
            url: a("#data-actions").attr("data-updateuser-url"),
            data: a("#update_userinfo").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                a("#update_userinfo #ajax_message").html(getTip("loading-detail"))
            },
            success: function (c) {
                !0 === c.success ? (a("#update_userinfo #ajax_message").html(c.message), window.location.href = a("#data-actions").attr("data-mybasicsettings-url")) : a("#update_userinfo #ajax_message").html(c.message)
            }
        });
        return !1
    }
}, v = {
    rules: {
        bbs_username: {
            required: !0
        },
        bbs_password: {
            required: !0
        }
    },
    messages: {
        bbs_username: {
            required: getTip("required-field")
        },
        bbs_password: {
            required: getTip("required-field")
        }
    },
    submitHandler: function () {
        a("#setting_forum_form").ajaxSubmit({
            url: a("#data-actions").attr("data-forum-setting-url"),
            data: a("#setting_forum_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                a("#setting_forum_form #ajax_message").html(getTip("loading-detail"))
            },
            success: function (c) {
                !0 === c.success ? (a("#setting_forum_form #ajax_message").html(c.message), window.location.href = a("#data-actions").attr("data-mybasicsettings-url")) : a("#setting_forum_form #ajax_message").html(c.message)
            }
        });
        return !1
    }
}, x = {
    rules: {
        email: {
            required: !0,
            email: !0,
            remote: function () {
                return a("#data-actions").attr("data-ajax-email")
            }
        },
        org_passwd: {
            required: !0,
            rangelength: [6, 15]
        },
        new_passwd: {
            required: !0,
            rangelength: [6, 15]
        },
        new_verify_passwd: {
            required: !0,
            rangelength: [6, 15],
            equalTo: "#new_passwd"
        }
    },
    messages: {
        email: {
            required: getTip("required-field"),
            email: getTip("not_valid"),
            remote: getTip("email_already_existed")
        },
        org_passwd: {
            required: getTip("required-field"),
            rangelength: getTip("password_not_valid")
        },
        new_passwd: {
            required: getTip("required-field"),
            rangelength: getTip("password_not_valid")
        },
        new_verify_passwd: {
            required: getTip("required-field"),
            rangelength: getTip("password_not_valid"),
            equalTo: getTip("password_not_match")
        }
    },
    submitHandler: function () {
        a("#update_password_form").ajaxSubmit({
            url: a("#data-actions").attr("data-ajax-resetpasswd"),
            data: a("#update_password_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
            },
            success: function (c) {
                !0 === c.success ? (showSuccess('修改成功！'),window.location.reload()) : showError('修改失败！')
            }
        });
        return !1
    }
}, w = {
    rules: {
        email: {
            required: !0,
            email: !0
        },
        password: {
            required: !0,
            minlength: 6
        },
        verifycode: {
            required: !0,
            remote: function () {
                return a("#data-actions").attr("data-vcheck-url")
            }
        }
    },
    messages: {
        email: {
            required: getTip("required-field"),
            email: getTip("not_valid")
        },
        password: {
            required: getTip("required-field"),
            minlength: getTip("not_valid")
        },
        verifycode: {
            required: getTip("required-field"),
            remote: getTip("vcode_wrong")
        }
    },
    submitHandler: function () {
        a("#login_form").ajaxSubmit({
            url: a("#data-actions").attr("data-login-url"),
            data: a("#login_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                show_message("info", getTip("loading-detail"), !1, 0)
            },
            success: function (a) {
                if (!0 === a.success) return show_message("success", a.message, !1, 0), setTimeout(function () {
                    window.location.reload()
                }, 1E3), !0;
                    show_message("error", a.message, !1, 0);
                    return !1
                }
            });
        return !1
    }
},User = {
    rules: {
        user_email: {
            required: !0,
            email: !0
        },
        user_password: {
            required: !0,
            minlength: 6
        },
        verifycode: {
            required: !0,
            remote: function () {
                return a("#data-actions").attr("data-vcheck-url")
            }
        }
    },
    messages: {
        user_email: {
            required: getTip("required-field"),
            email: getTip("not_valid")
        },
        user_password: {
            required: getTip("required-field"),
            minlength: getTip("not_valid")
        },
        verifycode: {
            required: getTip("required-field"),
            remote: getTip("vcode_wrong")
        }
    },
    submitHandler: function () {
        a("#user_login_form").ajaxSubmit({
            url: a("#data-actions").attr("data-login-url"),
            data: a("#user_login_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                show_message("info", getTip("loading-detail"), !1, 0)
            },
            success: function (a) {
                if (!0 === a.success) return show_message("success", a.message, !1, 0), setTimeout(function () {
                    window.location.reload()
                }, 1E3), !0;
                    show_message("error", a.message, !1, 0);
                    return !1
                }
            });
        return !1
    }
}, D = {
    rules: {
        bbs_username: {
            required: !0
        },
        bbs_password: {
            required: !0
        }
    },
    messages: {
        bbs_username: {
            required: getTip("required-field")
        },
        bbs_password: {
            required: getTip("required-field")
        }
    },
    submitHandler: function () {
        a("#bbs_login_form").ajaxSubmit({
            url: a("#data-actions").attr("data-bbslogin-url"),
            data: a("#bbs_login_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                show_message("info", getTip("loading-detail"), !1, 0)
            },
            success: function (a) {
                if (!0 === a.success) return show_message("success", a.message, !1, 0), setTimeout(function () {
                    window.location.reload()
                },
                1E3), !0;
                    show_message("error", a.message, !1, 0);
                    return !1
                }
            });
        return !1
    }
}, C = {
    rules: {
        nickname: {
            required: !0,
            byteRangeLength: [4, 20],
            remote: function () {
                return a("#data-actions").attr("data-ajax-nickname")
            }
        },
        email: {
            required: !0,
            email: !0,
            remote: function () {
                return a("#data-actions").attr("data-ajax-email")
            }
        },
        verifycode: {
            required: !0,
            remote: function () {
                return a("#data-actions").attr("data-vcheck-url")
            }
        },
        password: {
            required: !0,
            rangelength: [6, 15]
        },
        passconf: {
            required: !0,
            rangelength: [6, 15],
            equalTo: "#password"
        },
        terms: {
            required: !0
        }
    },
    messages: {
        nickname: {
            required: getTip("required-field"),
            byteRangeLength: getTip("nick_not_valid"),
            remote: getTip("nick_already_existed")
        },
        email: {
            required: getTip("required-field"),
            email: getTip("not_valid"),
            remote: getTip("email_already_existed")
        },
        verifycode: {
            required: getTip("required-field"),
            remote: getTip("vcode_wrong")
        },
        password: {
            required: getTip("required-field"),
            rangelength: getTip("password_not_valid")
        },
        passconf: {
            required: getTip("required-field"),
            rangelength: getTip("password_not_valid"),
            equalTo: getTip("password_not_match")
        },
        terms: {
            required: getTip("required-field")
        }
    },
    submitHandler: function () {
        a("#register_form").ajaxSubmit({
            url: a("#data-actions").attr("data-register-url"),
            data: a("#register_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                show_message("info", getTip("loading-detail"), !1, 0)
            },
            success: function (a) {
                !0 === a.success ? (show_message("success", a.message, !1, 0), window.location.reload()) : show_message("error", a.message, !1, 0)
            },
            error: function (a) {
                show_message("error", a, !1, 0)
            }
        });
        return !1
    }
}, y = {
    rules: {
        nickname: {
            required: !0,
            byteRangeLength: [4, 20],
            remote: function () {
                return a("#data-actions").attr("data-ajax-nickname")
            }
        },
        verifycode: {
            required: !0,
            remote: function () {
                return a("#data-actions").attr("data-vcheck-url")
            }
        }
    },
    messages: {
        nickname: {
            required: getTip("required-field"),
            byteRangeLength: getTip("nick_not_valid"),
            remote: getTip("nick_already_existed")
        },
        verifycode: {
            required: getTip("required-field"),
            remote: getTip("vcode_wrong")
        }
    },
    submitHandler: function () {
        a("#social_register_form").ajaxSubmit({
            url: a("#social_register_form").attr("data-url"),
            data: a("#social_register_form").formSerialize(),
            type: "POST",
            dataType: "json",
            beforeSubmit: function () {
                a("#ajax_message").html(getTip("loading-detail"))
            },
            success: function (c) {
                !0 === c.success ? (a("#ajax_message").html(c.message), window.location.href = a("#social_register_form").attr("data-redirect-url")) : a("#ajax_message").html(c.message)
            },
            error: function () {
                            //show_message("error", getTip("error") + ": " + getTip("server-error"), !1, 0)
                        }
                    });
        return !1
    }
}
})(jQuery);
jQuery.validator.addMethod("byteRangeLength", function (a,
    c, d) {
    for (var f = a.length, g = 0; g < a.length; g++) 127 < a.charCodeAt(g) && f++;
        return this.optional(c) || f >= d[0] && f <= d[1]
}, getTip("length_rang"));
jQuery.validator.addMethod("notDigit", function (a) {
    return /^[0-9]{1,20}$/.test(a) ? !1 : !0
}, getTip("not_all_digit"));
jQuery.validator.setDefaults({
    errorPlacement: function (b, c) {
        a(c).attr("data-original-title", b.text());
        a(c).tooltip({
            title: b.text(),
            placement: "top",
            template: '<div class="tooltip"><div class="tooltip-error-arrow"></div><div class="tooltip-inner error-tip"></div></div>',
            trigger: "manual"
        });
        a(c).tooltip("show");
        a(c).bind("keydown", function () {
            a(c).tooltip("hide")
        })
    }
});
a.oValidate("create_group_form");
a.oValidate("update_group_form");
a.oValidate("create_topic_form");
a.oValidate("update_topic_form");
a.oValidate("create_album_form");
a.oValidate("update_album_form");
a.oValidate("save_share_form");
a.oValidate("login_form");
a.oValidate("user_login_form");
a.oValidate("bbs_login_form");
a.oValidate("social_register_form");
a.oValidate("update_password_form");
a.oValidate("update_userinfo");
a.oValidate("setting_forum_form");
a.oValidate("update_goodshop_form");
a.oValidate("reset_password_form");
a.oValidate("forget_password_from")
});
$(document).ready(function (a) {
    function b(a) {
        a = {
            album_id: a
        };
        ajaxpost(t.attr("data-delalbum-url"), a, function (a) {
            getStaticDialog().hide();
            showSuccess(a.message, t.attr("data-myalbum-url"))
        }, function (a) {
            showError(a.message)
        })
    }

    function c(a, b, c) {
        a = {
            album_id: a,
            album_title: b,
            category_id: c
        };
        ajaxpost(t.attr("data-editalbum-url"), a, function (a) {
            getStaticDialog().hide();
            showSuccess(a.message, t.attr("data-myalbum-url"))
        }, function (a) {
            showError(a.message)
        })
    }
// edit by porter at 2013-12-19 16:09:56
function d(b, c, d) {
    //   d(b, "edit_item", "edit_item");
    var f = {
        'share_id': b
    };
        // edit by porter at 2013-12-20 16:32:12编辑拼图
        if("edit_item" == c){
         showDialog("edit_item",
            function () {
                a('#share_id').val(b);
                w("atlas",'edit_item',b);
                a.oValidate('edit_item_form');
            }
            );
     }
       // end edit
       else{
        ajaxpost(t.attr("data-ajaxgetshare-url"),
            f, function (f) {
                getTpl(d, function () {
                    var g = a("#" + d + "_tpl"),
                    h = a(g.html()).find("div.pbody"),
                    j = a(Mustache.to_html(h.html(), f)),
                    k = h.attr("data-width"),
                    l = h.attr("data-title"),
                    h = h.attr("data-css-class"),
                    j = getStaticDialog().width(k).head(l).body(j);
                    a.oValidate('forwarding_item_form');
                    j.elem.addClass(h);
                    "forwarding" == c ? (a("#forwarding_div").attr("data-sid", b),$('#share_id').val(b),$('.img-thumb img').attr('src',f.data.share.image_path+'_middle.jpg'), a("#forwarding_div").attr("data-uid", 0), w("forwarding_div", null, null), j.show()) : "edit_forwarding" == c ? (j.head(g.attr("data-edit-title")), a("#forwarding_div").attr("data-sid", b), a("#forwarding_div").attr("data-edit",
                        "1"), w("forwarding_div", f.data.share.category_id, f.data.share.category_name_cn), j.show()) : "edit_item" == c && (a("#item_detail_div").attr("data-sid", b), w("item_detail_div", f.data.share.category_id, f.data.share.category_name_cn), a.oValidate("edit_share_form"), "article" == f.data.share.share_type ? a("#image-area").css("display", "none") : a("#image-area").css("display", "inline-block"), j.show(), (g = a.oFEditor("m_editor")) ? (g.config.initialtext = f.data.share.intro, g._createHTML()) : a.oEditor("m_editor", {
                            id: "m_editor",
                            className: "editor",
                            initialtext: f.data.share.intro,
                            editorcurrentheight: 130,
                            editorminheight: 130,
                            editorcontroltop: !1,
                            editorid: "meditor"
                        }))
                    })
}, function (a) {
    showError(a.message)
})
}
}

// end edit


function addFollow(b) {
    var c = {
        'friend_id': b
    };
    ajaxpost(t.attr("data-addfollow-url"), c, function (c) {
        a("." + b + "-relation").html(c.data)
    }, function (a) {
        showError(a.message)
    })
}

function g(b) {
    var c = {
        'friend_id': b
    };
    ajaxpost(t.attr("data-removefollow-url"), c, function (c) {
        a("." + b + "-relation").html(c.data)
    }, function (a) {
        showError(a.message)
    })
}

function change_upload_data_url(b) {
    "website_fetch" == b ? (a("#share_type").val("web_fetch"),a("#save_share_form").attr("data-url", t.attr("data-fetch-save-url"))): "";
    "local_upload" == b ? (a("#share_type").val("upload"),a("#save_share_form").attr("data-url", t.attr("data-upload-save-url"))) : "";
}

function n(b) {
    F = b;
    a("#push_" + b).parent().find(".gallery").addClass("hide");
    a("#push_" + b).parent().parent().find(".active").removeClass("active");
    a("#push_" + b).removeClass("hide");
    a("#link_" + b).addClass("active")
}

function k(b, c) {
        //1111
        var d = 0 == c ? t.attr("data-fetch-url") : t.attr("data-video-fetch-url");

        a("#ajax_fetch_message").html("<div class='get_ing'>正在抓取</div>");
        a.ajax({
            type: "post",
            url: d,
            dataType: "json",
            data: {
                remote_url: b
            }
        }).error(function () {
            showError()
        }).success(function (b) {
            if (!0 === b.success) {
                var c = b.data.type;
                if ("images" == c) {
                    if (0 == b.data.images.length || void 0 == b.data.images.length) {
                        a("#ajax_fetch_message").html("<div class='get_error'>图片获取失败</div>");
                        return
                    }
                    var c = random(4),
                    d = b.data.images.length, 
                    f = 0,
                    info =b;
                    a("#no_image").size() && a("#no_image").remove();
                    a("#publish_image_list").html("");
                    for (var g = 0; g < d; g++) imageReady(b.data.images[g].src +
                        "?" + c, "", function () {
                            if (this.width > min_fetch_width && this.height > min_fetch_height) {
                                // edit by allen 2013-11-20 11:01:32 var b = a('<li data-action="publishPinItem" data-name="' + this.src + '" class="span2"><div class="thumbnail"><div class="img-thumb"><img src="' + this.src + '"/><i></i></div><input type="text" name="desc" class="desc" placeholder="' + getTip("type_some") + '"/></div></li>');
                                var b = a('<p><span>来源：</span>' + info.data.channel+ '</p><p><span>链接：</span>' + info.data.url +'</p><div class="thumbnail"><img src="' + this.src + '"></div>');
                                a("#publish_image_list").prepend(b);
                                a("#website_fetch").hide();
                                a("#image-area").show();
                            }
                        }, function () {
                            f++;
                            f === d && l()
                        }, function () {
                            f++
                        });
a("#reference_url").val(a("#remote_url").val());
a("#share_type").val("images");
a("#channel").val("others")
} else "channel" == c ? (c = a(Mustache.to_html('{{#item_imgs}}<li data-action="publishPinItem" data-name="{{url}}" class="span2"><div class="thumbnail"><div class="img-thumb"><img src="{{url}}_200x200.jpg"/><i></i></div><input type="text" name="desc" class="desc" placeholder="' + getTip("type_some") + '"/></div></li>{{/item_imgs}}', b.data)), a("#publish_image_list").html(c), l(), a("#share_type").val("channel"), a("#item_id").val(b.data.item_id), a("#channel").val(b.data.channel), a("#title").val(b.data.name).focus(),
    a("#price").val(b.data.price).focus(), a("#promotion_url").val(b.data.promotion_url).focus(), a.oFEditor("publish_editor").writeEditorContents(b.data.name), a("#reference_url").val(a("#remote_url").val())) : "video" == c && (c = a(Mustache.to_html('{{#data}}<li data-action="publishPinItem" data-name="{{imgurl}}" class="span2 selected cover"><div class="thumbnail"><div class="img-thumb"><img src="{{imgurl}}"/><i></i></div></li>{{/data}}', b)), a("#publish_image_list").html(c), l(), a("#share_type").val("video"),
    a("#title").val(b.data.title).focus(), a("#flv").val(b.data.flv).focus(), a.oFEditor("publish_editor").writeEditorContents(b.data.title), a("#reference_url").val(a("#remote_url").val()));
} else a("#ajax_fetch_message").html(getTip("fetch-faild")), showError(b.message)
})
}

function l() {
    var b;
    b = a("#publish_image_list").find("li.cover");
    var c = a("#publish_image_list").find("li");
    0 == b.length && (0 == c.length ? a("#upload_imgview_div").html("") : a("#upload_imgview_div").html('<img src="' +
        a(c[0]).find("img").attr("src") + '"/>'));
    c = a(b).next().length ? a(b).next() : c[0];
    a(b).removeClass("cover");
    a(c).addClass("cover");
    b = a(c).find("img").attr("src");
    a("#upload_imgview_div").html('<img src="' + b + '"/>');
    a("#cover_filename").val(a(c).attr("data-name"))
}

function j() {
    var b = a("#album_select_div");
    a("body").click(function (c) {
        c = a(c.target).attr("id");
        if (!("album_name" == c || "create_board" == c)) return !b || b.removeClass("btn_select_hover")
    });
    b.hasClass("btn_select_disabled") || b.addClass("btn_select_hover")
}

function m(b) {
    var c = a("#" + b);
    a("body").click(function () {
        return !c || c.removeClass("btn_select_hover")
    });
    c.hasClass("btn_select_disabled") || c.addClass("btn_select_hover")
}

function p(b, c, d, f) {
    d = a("#" + d);
    d.hasClass("btn_select_hover") && d.removeClass("btn_select_hover");
    d.find(".category_select_title").html(c);
    d.find(".category_select_id").val(b);
    null != f && void 0 != f && getAlbumList(f, b, null, null)
}

function o(b, c, d) {
    var f = {
        uid: b,
        sid: d,
        cid: c
    };
    J = d;
    S = "star";
    aa = b;
    Y = c;
    T = t.attr("data-starcovercrop-url");
    ajaxpost(t.attr("data-getstar-url"),
        f, function (b) {
            getTpl("star_open", function () {
                var c = a("#star_open_tpl"),
                d = a(c.html()).find("div.pbody"),
                c = a(Mustache.to_html(d.html(), b)),
                f = d.attr("data-width"),
                g = d.attr("data-title"),
                d = d.attr("data-css-class"),
                c = getStaticDialog().width(f).head(g).body(c);
                c.elem.addClass(d);
                c.show();
                null != b.data.star_cover && (void 0 != b.data.star_cover && "" != b.data.star_cover) && n(b.data.star_cover.style);
                I = b.data.image_path
            })
        }, function (b) {
            getTpl("star_open_confirm", function () {
                var c = a("#star_open_confirm_tpl"),
                d = a(c.html()).find("div.pbody"),
                c = a(Mustache.to_html(d.html(), b.data)),
                f = d.attr("data-width"),
                g = d.attr("data-title"),
                d = d.attr("data-css-class"),
                c = getStaticDialog().width(f).head(g).body(c);
                c.elem.addClass(d);
                c.show()
            })
        })
}

function q(a, b, c) {
    a = {
        txt: b,
        rid: a
    };
    ajaxpost(t.attr("data-apply" + c + "-url"), a, function (a) {
        showSuccess(a.message);
        getStaticDialog().hide()
    }, function (a) {
        showError(a.message)
    })
}

function v(a, b, c) {
    c = {
        sreason: c,
        uid: b,
        rid: a
    };
    ajaxpost(t.attr("data-savestar-url"), c, function () {
        o(b, a, J)
    }, function (a) {
        showError(a.message)
    })
}

function x(b,
    c) {
    var d = a(c),
    f = {
        cid: b,
        radom: random(5)
    };
    ajaxget(t.attr("data-simpletag-url"), f, function (b) {
        var c = d.attr("data-target-id"),
        b = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-aid="{{tag_id}}" data-action="getTags" data-params="{{tag_id}},{{tag_group_name_cn}}" class="box">{{tag_group_name_cn}}</a></li>{{/data}}', b));
        d.html(b);
        d.prepend('<li><span>热门标签：</span></li>')
    }, function (a) {
        showError(a.message)
    })
}

//w("forwarding_div", null, null)
function w(b, c, d) {
    var f = a("." + b).find(".category_select_list"),
    g = f.attr("data-init");
    if ("0" == g) {
        var j = a(".atlas-content"),
        g = {
            radom: random(5)
        };
        ajaxget(t.attr("data-albumlist-url"),
            g, function (g) {
                //默认选中上次一采集图片选中的专辑
                a("." + b).find(".album_select_title").html(g.data.lastAlbumTitle);
                a("." + b).find("#ablum_select_id").val(g.data.lastAlbumId);
                var k = a(Mustache.render('{{#data.albums}}<li><a href="javascript:;" data-aid="{{album_id}}" data-action="albumItem" data-params="{{album_id}},{{album_title}},' + b + '">{{album_title}}</a></li>{{/data.albums}}', g));
                j.prepend(k);
                f.attr("data-init", 1);
                    if(b=='atlas'&&c=='edit_item'){ // 如果是编辑专辑,则初始化专辑和简介
                        ajaxget(t.attr("data-shareInfo-url"), {'share_id':d}, function (result) {
                            $(".atlas").find(".album_select_title").html(result.data.album_title);
                            $(".atlas").find("#ablum_select_id").val(result.data.album_id);
                            $('#intro').val(result.data.intro);
                        }, function (a) {
                            showError(a.message);
                        })
                    }

                }, function (data) {//如果没有任何专辑.就提示新建
                    showDialog("publish_url",
                        function () {
                            a("#website_fetch").css('display','none');
                            a("#create_album").css('display','block');
                            a(".hd h2").html("<span style='font-size:15px'>你还没有任何专辑,请先创建专辑</span>");
                            category_list("category");
                            a.oValidate("create_album_form");
                        });
                    return !1
                })
}
}

    //edit by porter at 2013-12-11 09:34:10 初始化好店上传文件对话框数据
    function init_upload_goodshop(b, c, d) {
        var f = a("." + b).find(".board_select_list"),
        g = f.attr("data-init");
        if ("0" == g) {
            var board_content = a(".board-content"),
            g = {
                radom: random(5)
            };
            ajaxget(t.attr("data-goodshopboardslist-url"),
                g , function(g){
                    var k = Mustache.render('{{#data}}<li><a href="javascript:;" data-aid="{{board_id}}" data-action="boardItem" data-params="{{board_id}},{{board_title}},' + b + '">{{board_title}}</a></li>{{/data}}', g);
                //好店里面幽默人专辑;
                k = '<li><a href="javascript:;" data-aid="1" data-action="boardItem" data-params="1,默认专辑,' + b + '">默认专辑</a></li>' + k;
                k = a(k);   
                board_content.prepend(k);
                f.attr("data-init", 1);
                }, function(data){ //专辑为空
                    var k = '<li><a href="javascript:;" data-aid="1" data-action="boardItem" data-params="1,默认专辑,' + b + '">默认专辑</a></li>' + k;
                    k = a(k);   
                    board_content.prepend(k);
                    f.attr("data-init", 1);
                })
        }
    }
    // end edit
    
    //初始化分类信息，默认选中第一个
    function category_list(clazz,category_id){
        var category_id = arguments[1]?arguments[1]:0;  //模拟js默认参数，判断是否存在第二个参数，如不存在，赋值0
        var category_select_list = $("." + clazz).find(".category_select_list"),
        data_init = category_select_list.attr("data-init");
        if ("0" == data_init) {
           var category_content = $(".category-content"),
           rand = {
               radom: random(5)
           };
           ajaxget(t.attr("data-categorylist-url"),
               rand, function (result) {
                    //初始化分类信息
                    if(!category_id){
                        $("." + clazz).find(".category_select_title").html(result.data[0].category_title); //默认选中第一个分类
                        $("." + clazz).find("#category_select_id").val(result.data[0].category_id);

                    }
                    for(var i=0;i<result.data.length;i++){
                        if(result.data[i].category_id == category_id){
                            $("." + clazz).find(".category_select_title").html(result.data[i].category_title); //默认选中第一个分类
                            $("." + clazz).find("#category_select_id").val(result.data[i].category_id);
                            break;
                        }
                    }
                    var options = $(Mustache.render('{{#data}}<li><a href="javascript:;" data-aid="{{category_id}}" data-action="categoryItemShow" data-params="{{category_id}},{{category_title}},' + clazz + '">{{category_title}}</a></li>{{/data}}', result));
                    category_content.prepend(options);
                //     j.prepend('<li><a data-params="1,选择分类,atlas" data-action="albumItem" data-aid="1" href="javascript:;">默认专辑</a></li>');
                category_select_list.attr("data-init", 1);
            }
            , function (a) {
               showError(a.message);
           })
}
}

function D(b) {
    var c = a("#" + b).find(".category_select_list");
    a("body").click(function () {
        return !c || c.removeClass("btn_select_hover")
    });
    c.hasClass("btn_select_disabled") || c.addClass("btn_select_hover")
}

function C(b) {
    var c = a(".popup");
    c.css('display', 'block');
}

    // edit by porter at 2013-12-11 10:29:29
    function boardItemPopup(b) {
        var c = a(".board-popup");
        c.css('display', 'block');
    }
    // end edit
    function F(b) {
       var c = a(".category > .popup");
       c.css('display', 'block');
   }

    // edit by porter at 2013-12-17 09:25:54添加拼图时添加专辑,分类id为0
    function y(b, c) {
        var d = a("." + b),
        f = d.find(".album_name"),
        d = d.find(".category_select_id"),
        category_id = d.val();
        if(category_id==null||category_id=='undefined'){
            category_id = 0;
        }
        d = {
            album_title: f.val(),
            category_id: category_id,
            uid: c
        };
        ajaxpost(t.attr("data-ajax-albumcreate"),
            d, function (c) {
                var album_id = c.data.album_id,
                album_title = f.val();
                a("." + b).find(".album_select_title").html(album_title);
                a("." + b).find("#ablum_select_id").val(album_id);
                a('.popup').css('display', 'none');
                var k = a('<li><a href="javascript:;" data-aid="'+album_id+'" data-action="albumItem" data-params="'+album_id+','+album_title+',atlas">'+album_title+'</a></li>');
                a(".atlas-content").prepend(k);
            }, function (a) {
                showError(a.message)
            })
    }
    function M(b, c, d, f) {
        var g = a("#" + d),
        h = g.find(".category_select_list");
        h.hasClass("btn_select_hover") && h.removeClass("btn_select_hover");
        h.find(".category_select_title").html(c);
        h.find(".category_select_id").val(b);
        0 != f && (null != f && "" != f && void 0 != f) && ((f = g.find(".album_select_list")) ? (c = f.attr("data-album-id"),
            f = f.attr("data-album-name"), H(d, b, c, f)) : H(d, b, null, null));
        (d = g.find(".tags_list")) && x(b, d)
    }

    function O(b, c, d) {
        a(".category_select_list").attr('data-init',b);
        d = a(".category_select_list");
        f = a(".popup");
        d.find(".album_select_title").html(c);
        d.find("#ablum_select_id").val(b);
        f.css('display', 'none');
    }

    //edit by porter at 2013-12-11 10:51:17
    function boardItem(b, c, d) {
        a(".board_select_list").attr('data-init',b);
        d = a(".board_select_list");
        f = a(".board-popup");
        d.find(".board_select_title").html(c);
        d.find("#board_select_id").val(b);
        f.css('display', 'none');
    }
    // end edit
    
    function O1(b,c,d){
        a(".category > .category_select_list").attr('data-init',b);
        d = a(".category > .category_select_list");
        f = a(".category > .popup");
        d.find(".category_select_title").html(c);
        d.find("#category_select_id").val(b);
        f.css('display', 'none');
    }

    function H(b, c,
        d, f) {
        var g = a("#" + b),
        h = g.find(".album_select_list"),
        j = h.find("ul"),
        g = g.attr("data-uid"),
        c = {
            cid: c,
            uid: g,
            radom: random(5)
        };
        ajaxget(t.attr("data-albumlist-url"), c, function (c) {
            var g = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-aid="{{album_id}}" data-action="albumItem" data-params="{{album_id}},{{album_title}},' + b + '">{{album_title}}</a></li>{{/data}}', c));
            j.html(j.children(":last"));
            g.insertBefore(j.children(":last"));
            null == d || void 0 == d || null == f || void 0 == f ? O(c.data[0].album_id, c.data[0].album_title,
                b) : O(d, f, b);
            h.attr("data-init", 1)
        }, function () {
            var a = j.children(":last");
            j.html(a);
            O(null, null, b)
        })
    }

    function B(b, c) {
        var d = {
            sid: b,
            hash: c
        };
        ajaxpost(t.attr("data-delcomment-url"), d, function () {
            a("#comment_" + c).fadeTo(1E3, "hide", 0)
        }, function (a) {
            showError(a.message)
        })
    }

    function u(b) {
        var c = b.split(":");
        A = c[0];
        X = c[1];
        var d = {
            path: I,
            sid: J
        };
        getTpl("crop_dialog", function () {
            var c = a("#crop_dialog_tpl"),
            f = a(c.html()).find("div.pbody"),
            c = a(Mustache.to_html(f.html(), d)),
            g = f.attr("data-width"),
            h = f.attr("data-title"),
            f = f.attr("data-css-class"),
            c = getStaticDialog().width(g).head(h).body(c);
            c.elem.addClass(f);
            c.show();
            a("#ui_puzz_dialog").imagesLoaded(function () {
                null != crop_image && void 0 != crop_image && crop_image.remove();
                setTimeout(function () {
                    crop_image = a("#crop_image_" + J).imgAreaSelect({
                        zIndex: 2E3,
                        instance: !0,
                        aspectRatio: b,
                        show: !0,
                        x1: 5,
                        y1: 5,
                        x2: 100,
                        y2: 100,
                        handles: !0
                    })
                }, 500)
            })
        })
}

function N(b, c) {
    getTpl("push_dialog", function () {
        var b = {
            cid: c
        };
        ajaxpost(t.attr("data-fetchhotshare-url"), b, function (b) {
            var c = a("#push_dialog_tpl"),
            d = a(c.html()).find("div.pbody"),
            c = a(Mustache.to_html(d.html(), b)),
            f = d.attr("data-width"),
            g = d.attr("data-title"),
            d = d.attr("data-css-class"),
            c = getStaticDialog().width(f).head(g).body(c);
            c.elem.addClass(d);
            c.show();
            n(b.data.style)
        }, function (a) {
            showError(a.message)
        })
    })
}

function L(b, c, d, f, g, h, j, k, l) {
    a("#crop_dialog_tpl");
    var m = S,
    n = aa;
    ajaxpost(T, {
        sid: b,
        rid: c,
        cid: c,
        uid: n,
        position: d,
        x: f,
        y: g,
        w: h,
        h: j,
        js_w: k,
        js_h: l,
        ww: A,
        hh: X,
        sy: F
    }, function () {
        "home" == m ? N(b, c) : "star" == m && o(n, c, b)
    }, function (a) {
        showError(a.message)
    })
}

function U(b) {
    var c = {
        'share_id': b
    };
    ajaxpost(t.attr("data-delshare-url"), c, function () {
        a("#" + b).fadeTo(1E3, "hide", 0);
        setTimeout(function () {
            a("#waterfall").masonry("remove", a("#" + b));
            a("#waterfall").masonry("reload");
            a("#timeline-box").masonry("remove", a("#" + b));
            a("#timeline-box").masonry("reload", function () {
                P()
            })
        }, 1E3)
    }, function (a) {
        showError(a.message)
    })
}

function P() {
    var b = a("#timeline-box"),
    c = b.find(".timeline");
    a.each(c, function (b, c) {
        var d = a(c).css("left"),
        f = a(c).find(".corner");
        a(f).html("0px" == d || "auto" ==
            d ? "<span class='right-line'><i class='right-corner'></i><i class='pointer'></i></span>" : "<span class='left-line'><i class='left-corner'></i><i class='pointer'></i></span>")
    });
    c = b.find(".line");
    b = b.height();
    a(c).css("height", b)
}

function Q(b, c, d, f, g) {
        // Q(comment_detail_tpl, 55, content, "comment",1);
        var h = a("#" + b),
        j = h.attr("reload"),
        b = {
            'share_id': c,
            comment: d,
            type: f
        };
        ajaxpost(t.attr("data-addcomment-url"), b, function (b) {
            b = a(Mustache.to_html(h.html(), b));                                            
             //如果评论数超过5.,就删掉最后一个
             a("#comments_" + c).append(b);
             if(a("#comments_" + c + " .comment").length>5) { 
                a("#comments_" + c + " .comment:last-child").remove();
            } 
            b.fadeIn(2E3);
            // edit by porter at 2013-12-09 16:56:01 add a('#'+c+"_comment").text(Number(a('#'+c+"_comment").text())+1);--评论成功数字加一
            a('#comment_'+c).text(Number(a('#comment_'+c).text())+1); // 瀑布流评论个数
            $('.the-comment .meta-head strong').text(Number($('.the-comment .meta-head strong').text())+1); // 图片详细页评论个数
            "comment_detail_tpl" == h ? a.oFEditor("r_editor").writeEditorContents("") :
            a("#commentbox_" + c).val("");
            j && (a("#commentdiv_" + c).addClass("hide"), a("#waterfall").masonry("reload"));
            check_message("reward", !0, 3E3, 700)
        }, function (a) {
            showError(a.message)
        })
}

    /**
     * 二级评论,回复一级评论的评论
     * @param  {[type]} comment_id [一级评论的id]
     * @param  {[type]} content    [评论内容]
     */
     function commentReply(comment_id,content){
        var static_include = $('#reply_detail_tpl'),
        data = {
            'comment_id' : comment_id,
            'content'    : content, 
        }
        ajaxpost(t.attr("data-commentreply-url"), data, function (b) {
            b = a(Mustache.to_html(static_include.html(), b));
            g ? a("#reply_" + comment_id).append(b) : (a("#reply_" + comment_id).append(b),a("#reply_" + comment_id + " .comment:last-child").remove());
            //edit by porter at 2013-12-19 15:48:32弹出详细页评论修复不能及时更新数据的问题
            g ? a("#" + comment_id + "_comments_a_reply").append(b) : a("#" + comment_id + "_comments_a_reply").append(b);
            // end edit
            b.fadeIn(2E3);
          // $('.the-comment .meta-head').text(Number($('.the-comment .meta-head').text())+1);
          check_message("reward", !0, 3E3, 700)
      }, function (a) {
        showError(a.message)
    })
    }

    function z(a, b) {
        return ["toolbar=0,status=0,resizable=1,width=" + a + ",height=" + b + ",left=", (screen.width - a) / 2, ",top=", (screen.height - b) / 2].join("")
    }

// K(t.attr("data-avatarupload-url"), "avatar_upload_btn", "avatar_upload_file", "avatar_img_div", !0, 180, 180)
function K(b, c, d, f, g, h, j) {
    var k = a("#" + c),
    l;
    new AjaxUpload(k, {
        action: b,
        name: "qqfile",
        responseType: "json",
        onSubmit: function () {
            k.text(getTip("select_file"));
            this.disable();
            l = window.setInterval(function () {
                var a = k.text();
                13 > a.length ? k.text(a + ".") : k.text(getTip("uploading"))
            }, 200)
        },
        onComplete: function (b, c) {
            k.text(getTip("select_file"));
            window.clearInterval(l);
            this.enable();
            if (!0 === c.success) {
                a("#local_upload").hide();
                a("#image-area").show();
                var m = c.data.filename + "." + c.data.ext,
                Z = base_url + m;
                g ? (a("#" + f).html('<img class="image_croped" src="' + Z + '" style="max-width:' + h + "px;max-height: " +
                    j + 'px;"/>'), a("#" + d).val(m), a("#" + f).imagesLoaded(function () {
                      //  null != crop_image && void 0 != crop_image && crop_image.remove();
                      crop_image = a("#" + f + " .image_croped").imgAreaSelect({
                        zIndex: 2E3,
                        instance: !0,
                        show: !0,
                        aspectRatio: h + ":" + j,
                        x1: 0,
                        y1: 0,
                        x2: 100,
                        y2: 100,
                        handles: !0
                    })
                  })) :  (m = a('<div class="thumbnail"><img data-name="' + m + '" src="' + Z + '"/></div>'), a("#publish_image_list").append(m))
            } else showError(c.message)
        }
    })
}

//W(t.attr("data-avatarsave-url"), d.x1, d.y1, f, g, c, h, b, "avatar");
function W(b, c, d, f, g, h, j, k, l) {
    var shop_id = a('#shop_id').val();
    show_loading("success");
    var m = "";
    "topic" == l ? m = "&topicid=" + a("#banner_topicid").val() : "group" == l && (m = "&groupid=" + a("#banner_groupid").val());
    a.ajax({
        type: "post",
        url: b,
        dataType: "json",
        data: "x=" + c + "&y=" + d + "&w=" + f + "&h=" + g + "&js_w=" + h + "&js_h=" +
        j + "&filename=" + k + "&type=" + l + m +"&shop_id=" + shop_id
    }).error(function () {
        showError()
    }).success(function (b) {
        hide_loading();
            if (!0 === b.success) // edit by porter at 2013-12-12 16:44:06 add else if logo == l
                if ( "avatar" == l|| "logo" == l) console.debug(b),a("#avatar_upload_file").val(""), a("#avatar_img_div .image_croped").addClass("hide"), a("#avatar_large_div").removeClass("hide").html('<img src="' + base_url_r + b.data.avatar_local + "_large_avatar.jpg?" + b.data.hash + '" width="150" height="150"/>'), a("#avatar_middle_div").removeClass("hide").html('<img src="' + base_url_r + b.data.avatar_local +
                    "_middle_avatar.jpg?" + b.data.hash + '" width="50" height="50"/>'), a("#avatar_small_div").removeClass("hide").html('<img src="' + base_url_r + b.data.avatar_local + "_small_avatar.jpg?" + b.data.hash + '" width="16" height="16"/>'), a("#saveAvatarBtn").html('<button type="submit" data-action="closePushDialog" class="btn btn-primary"><span>' + getTip("done") + "</span></button>"), check_message("reward", !0, 3E3, 1500);
                    else if ("banner" == l) a("#banner_upload_file").val(""), a("#banner_img_div").removeClass("hide").html('<img src="' + base_url_r +
                        b.data.avatar_local + "_banner.jpg?" + b.data.hash + '" width="500" height="133"/>'), a("#saveBannerBtn").html('<button type="submit" data-action="closePushDialog" class="btn btn-primary"><span>' + getTip("done") + "</span></button>");
                        else {
                            if ("topic" == l || "group" == l) {
                                var c = "topic" == l ? '" width="500" height="133"/>' : '" width="133" height="133"/>';
                                a("#banner_upload_file").val("");
                                a("#banner_img_div").removeClass("hide").html('<img src="' + base_url_r + b.data.banner + "?" + b.data.hash + c);
                                a("#saveBannerBtn").html('<button type="submit" data-action="closePushDialog" class="btn btn-primary"><span>' +
                                    getTip("done") + "</span></button>")
                            }
                        } else showError(b.message)
                    })
}
var t = a("#data-actions"),
J, Y, S, T, I, G, F, A, X, aa;
a("#body").actionController({
    controller: {
        vcodeRefreshClick: function () {
            a(this).parent().find("img").attr("src", t.attr("data-vcode-url") + "?" + random(3));
            return !1
        },
        focusClick: function (b, c) {
            a("#" + c).focus();
            return !1
        },
        openLoginDialogClick: function () {
            openLoginDialog();
            return !1
        },
        openRegisterDialogClick: function () {
            showDialog("register_box", function () {
                a.oValidate("register_form")
            });
            return !1
        },
        openPublishSelectDialogClick: function () {
            showDialog("publish_select",
                function () {});
            return !1
        },
        //add by allen 2013-11-19 15:04:45
        openPublishUrlDialogClick: function (b,c) {
            showDialog("publish_url", function () {
                $('#remote_url').focus();
                a.oValidate("save_share_form");
                change_upload_data_url(c);
            });
            return !1
        },
        openPublishLocalDialogClick: function (b,c) {
            showDialog("publish_url", function () {
                a("#website_fetch").css('display','none');
                a("#local_upload").css('display','block');
                a(".hd h2").html("本地上传");
                a.oValidate("save_share_form");
                K(t.attr("data-upload-url"), "item_upload_btn", "cover_filename", "upload_imgview_div", !1, 150, 180);
                w("atlas", null, null);
                change_upload_data_url(c);
                // 自定义标签长度不能操过6
                $('#addTag').bind('input propertychange', function() {  
                    if(len($(this).val()) > 12||len($(this).val()) <= 0){
                        $(this).next('em').addClass('disabled').attr('data-action','');
                    }
                    else if(len($(this).val()) > 0){
                        $(this).next('em').removeClass('disabled').attr('data-action','addTag');
                    }
                });
            });
            return !1
        }, // allen todo
        openGoodShopLocalDialogClick: function (b,c,d,e,f) {
            var shop_id = d,
            user_id = e,
            board_id = f;
            showDialog("publish_goodshop", function () {
                a("#website_fetch").css('display','none');
                a("#local_upload").css('display','block');
                a(".hd h2").html("本地上传");
                a.oValidate("save_share_form");
                K(t.attr("data-upload-url"), "item_upload_btn", "cover_filename", "upload_imgview_div", !1, 150, 180);
                w("atlas", null, null); 
                init_upload_goodshop("boards", null, null); //初始化好店专辑
                change_upload_data_url(c); //改变数据提交form的data-url
                a("#shop_id").val(shop_id);
                a("#user_id").val(user_id);
                a("#board_id").val(board_id);
            });
            return !1
        }, // add by allen 评论框 打分
        openAppraiseDialogClick: function (b,c,d) {
            showDialog("appraise",
                function () {
                    var is_click = true;
                    var num = 0;
                    $('#appraise_d span.rate a').mouseover(function(){
                        if(is_click){
                            $(this).addClass('active');
                            $(this).prevAll('a').addClass('active');
                        }
                    }).mouseleave(function(){
                        if(is_click){
                            $(this).removeClass('active');
                            $(this).siblings('a').removeClass('active');
                        }
                    });
                    $('#appraise_d span.rate a').click(function(){
                        num = 0;
                        is_click = false;
                        $(this).addClass('active');
                        $(this).siblings('a').removeClass('active');                            
                        $(this).prevAll('a').addClass('active');
                        num = $(this).prevAll('a').length + 1;
                        $('#appraise_num').val(num);
                    });
                    $('#shop_id').val(c);
                    $('#user_id').val(d);
                }
            );
            return !1
        },
        appraiseSubmitClick: function(){
            $.ajax({
                url: t.attr("data-appraise-url"),
                type: 'post',
                dataType: 'json',
                data: $('#appraiseSubmit').serialize(),
                success: function(result){
                    if(result.success){
                        showSuccess(result.message,true);
                    }else{
                        showError(result.message);
                    }
                }
            });
            return !1;
        },
        openPublishAlbumDialogClick: function () {
            showDialog("publish_url",
                function () {
                    a("#website_fetch").css('display','none');
                    a("#create_album").css('display','block');
                    a(".hd h2").html("创建专辑");
                    category_list("category");
                    a.oValidate("create_album_form");
                });
            return !1
        },
        openPublishBoardDialogClick: function (b,shop_id) {
            showDialog("publish_goodshop",
                function () {
                    a("#website_fetch").css('display','none');
                    a("#create_board").css('display','block');
                    a(".hd h2").html("创建专辑");
                                //初始化窗口各参数category_list("category");
                                $('#board_shop_id').val(shop_id);
                                a.oValidate("create_board_form");
                            });
            return !1
        },
        webFetchSubmitClick: function(){
            var url = $('#remote_url').val();
            if(url.indexOf("diuzhuan") > 0){
                showError("仅支持外部网站抓取，站内请直接收集");
                return false;
            }
            $('#website_fetch form').hide();
            $('#website_fetch #loading').show();
        },
        createNewTagsClick: function (b, c,d){
            if(!a("#select-tag").has('a').length){
                a(this).html("");
                a(this).addClass('selected-tag').addClass('clearfix').removeAttr('data-action');
                a(".more-tag").css('display','block');
                b = a("." + c); 
                if(!b.has('a').length){
                    var d = a(b),
                    f = {
                        radom: random(5)
                    };
                    ajaxget(t.attr("data-simpletag-url"), f, function (b) {
                        var b = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-cid="{{category_id}}" data-aid="{{tag_id}}" data-action="addTags" data-params="{{tag_group_name_cn}}" class="box">{{tag_group_name_cn}}</a></li>{{/data}}', b));
                        d.html(b);
                        d.prepend('<li><span>热门标签：</span></li>')
                    }, function (a) {
                        showError(a.message)
                    })
                }
            }                
        },
        addTagsClick: function (b,c){
            f = a(this).attr('data-cid');
            a(".new_tags_list a").removeAttr('data-action').addClass('active');             
            b = '<a href="javascript:void(0);" data-action="removeNewTags" data-params="'+c+'">'+c+'</a>';
            a("#select-tag").append(b);               
            a("#tags-input").val(f);
        },
        removeNewTagsClick: function (){
            a(this).remove();
            a(".new_tags_list a").attr('data-action','addTags').removeClass('active');
            a("#tags-input").val("");
        },
        closeCreateTagClick: function() {
            a(".more-tag").css('display','none');
            a("#select-tag").attr('data-action','createNewTags')
            if(!a("#select-tag").has('a').length){
                a("#select-tag").removeClass('selected-tag').removeClass('clearfix').append('添加适合的标签，方便大家找到');
            }  
        },
        //end by allen
        openPublishDialogClick: function (b, c) {
            showDialog("publish", function () {
                a.oValidate("save_share_form");
                K(t.attr("data-upload-url"), "item_upload_btn", "cover_filename", "upload_imgview_div", !1, 150, 180);
                w("category_select_div", null, null);
                change_upload_data_url(c);
                a.oEditor("publish_editor", {
                    id: "publish_editor",
                    className: "editor",
                    initialtext: "",
                    editorcurrentheight: 130,
                    editorminheight: 130,
                    editorcontroltop: !1,
                    editorid: "editor"
                })
            })
        },
        collectPublishClick: function (b, c) {
            a.oValidate("save_share_form");
            K(t.attr("data-upload-url"),
                "item_upload_btn", "cover_filename", "upload_imgview_div", !1, 150, 180);
            w("category_select_div", null, null);
            change_upload_data_url(c);
            a.oEditor("publish_editor", {
                id: "publish_editor",
                className: "editor",
                initialtext: "",
                editorcurrentheight: 130,
                editorminheight: 130,
                editorcontroltop: !1,
                editorid: "editor"
            })
        },
        postTGShareClick: function (b, c, d) {
            showDialog("publish", function () {
                a.oValidate("save_share_form");
                a.oEditor("publish_editor", {
                    id: "publish_editor",
                    className: "editor",
                    initialtext: "",
                    editorcurrentheight: 130,
                    editorminheight: 130,
                    editorcontroltop: !1,
                    editorid: "editor"
                });
                K(t.attr("data-upload-url"), "item_upload_btn", "cover_filename", "upload_imgview_div", !1, 150, 180);
                w("category_select_div", null, null);
                change_upload_data_url("local_upload");
                "group" == c ? a("#groupid").val(d) : "topic" == c && a("#topicid").val(d)
            })
        },
        joinGroupClick: function (a, b) {
            var c = {
                groupid: b
            };
            ajaxpost(t.attr("data-joinGroup-url"), c, function (a) {
                showSuccess(a.message, !0)
            }, function (a) {
                showError(a.message)
            })
        },
        sendMessageOpenClick: function (b, c) {
            showDialog("message", function () {
                c && a("#send_message_form #message_user").val(c);
                a.oValidate("send_message_form")
            })
        },
        forwardingClick: function (a, b) {
            d(b, "forwarding", "forwarding");
            return !1
        },
        forwardingSaveClick: function () {

            return !1
        },
        openAvatarClick: function (a,avatar) {
            showDialog("avatar", function () {
                $('#avatar_large_div img').attr('src',avatar+"_large_avatar.jpg");
                $('#avatar_middle_div img').attr('src',avatar+"_middle_avatar.jpg");
                $('#avatar_small_div img').attr('src',avatar+"_small_avatar.jpg");
                K(t.attr("data-avatarupload-url"), "avatar_upload_btn", "avatar_upload_file", "avatar_img_div", !0, 180, 180)
            });
            return !1
        },
        // edit by porter at 2013-12-12 15:36:23 设置店铺logo
        openLogoClick: function (c,b,logo) {
            showDialog("logo", function () {
                a('#shop_id').val(b);
                $('#avatar_large_div img').attr('src',logo+"_large_avatar.jpg");
                $('#avatar_middle_div img').attr('src',logo+"_middle_avatar.jpg");
                $('#avatar_small_div img').attr('src',logo+"_small_avatar.jpg");
                K(t.attr("data-avatarupload-url"), "avatar_upload_btn", "avatar_upload_file", "avatar_img_div", !0, 180, 180)
            });
            return !1
        },
        // end edit
        openBannerClick: function (b, c, d) {
            showDialog("banner", function () {
                K(t.attr("data-avatarupload-url"), "banner_upload_btn", "banner_upload_file", "banner_img_div", !0, 500,
                    133);
                "topic" == c ? (a("#banner_topicid").val(d), a("#banner_type").val("topic"), a("#banner_img_div img").attr("src", a("#banner_topic_" + d).attr("src")), K(t.attr("data-avatarupload-url"), "banner_upload_btn", "banner_upload_file", "banner_img_div", !0, 500, 133)) : "group" == c && (a("#banner_groupid").val(d), a("#banner_type").val("group"), a("#banner_img_div img").attr("src", a("#banner_group_" + d).attr("src")), K(t.attr("data-avatarupload-url"), "banner_upload_btn", "banner_upload_file", "banner_img_div", !0, 180, 180))
            });
            return !1
        },
        applyOpenClick: function (b, c) {
            showDialog("apply", function () {
                a("#apply_tpl").attr("data-applytype", c)
            });
            return !1
        },
        applyStoreOpenClick: function (b,shop_id) {
            var b = {
                shop_id: shop_id
            };
            ajaxpost(t.attr("data-applyStore-url"), b, function (b) {
                showSuccess(b.message)
            }, function (a) {
                showError(a.message)
            })
            return !1
        },
        recommendStoreOpenClick: function(){
            showDialog("recommend_store",function(){
                // edit by porter at 2013-12-16 10:39:39 添加城市联动
                a("#citySelect").citySelect({
                    nodata:"none",
                    required:false
                }); 
            });
            return !1
        },
        // end by allen
        // edit by porter at 2013-12-20 16:45:39网页收集添加拼图功能
        webPinClick: function(b,url,reference_url){
            showDialog("web_pin",function(){
                $('#reference_url').val(reference_url);
                $('#url').val(url);
                $('#img').attr('src',url);
                w("atlas",null,null);
                a.oValidate("web_pin_form");
                // 自定义标签长度不能操过6
                $('#addTag').bind('input propertychange', function() {  
                    if(len($(this).val()) > 12||len($(this).val()) <= 0){
                        $(this).next('em').addClass('disabled').attr('data-action','');
                    }
                    else if(len($(this).val()) > 0){
                        $(this).next('em').removeClass('disabled').attr('data-action','addTag');
                    }
                });
            });
            return !1
        },
        // end edit
        starOpenClick: function (a, b, c, d) {
            o(c, d, b);
            return !1
        },
        closePushDialogClick: function () {
            getStaticDialog().hide();
            return !1
        },
        saveAvatarClick: function () {
            var b = a("#avatar_upload_file").val();
            if (null == b || void 0 == b || "" == b) showError(getTip("no-selection"));
            else {
                var c = a("#avatar_img_div .image_croped"),
                d = crop_image.getSelection(),
                f = d.x2 - d.x1,
                g = d.y2 - d.y1,
                h = c.height(),
                c = c.width();
                W(t.attr("data-avatarsave-url"), d.x1, d.y1, f, g, c, h, b, "avatar");
                return !1
            }
        },
        // edit by porter at 2013-12-12 15:16:25 上传店铺logo
        saveLogoClick: function () {
            var b = a("#avatar_upload_file").val();
            if (null == b || void 0 == b || "" == b) showError(getTip("no-selection"));
            else {
                var c = a("#avatar_img_div .image_croped"),
                d = crop_image.getSelection(),
                f = d.x2 - d.x1,
                g = d.y2 - d.y1,
                h = c.height(),
                c = c.width();
                W(t.attr("data-avatarsave-url"), d.x1, d.y1, f, g, c, h, b, "logo");
                return !1
            }
        },
        // end edit
        saveBannerClick: function () {
            var b =
            a("#banner_upload_file").val();
            if (null == b || void 0 == b || "" == b) showError(getTip("no-selection"));
            else {
                var c = a("#banner_img_div .image_croped"),
                d = crop_image.getSelection(),
                f = d.x2 - d.x1,
                g = d.y2 - d.y1,
                h = c.height(),
                c = c.width(),
                j = "banner",
                k = t.attr("data-avatarsave-url");
                "topic" == a("#banner_type").val() ? (j = "topic", k = t.attr("data-tbannersave-url")) : "group" == a("#banner_type").val() && (j = "group", k = t.attr("data-gbannersave-url"));
                W(k, d.x1, d.y1, f, g, c, h, b, j);
                return !1
            }
        },
        deleteShareClick: function (a, b) {
            confirm(getTip("confirm-delete-share")) &&
            U(b);
            return !1
        },
        //添加评论
        addCommentBoxClick: function (b, c) {
            a("#waterfall").find(".commentdiv").addClass("hide");
            a("#" + c + "_commentdiv").removeClass("hide");
            a("#waterfall").masonry("reload");
            a("#" + c + "_commentbox").focus();
            return !1
        },
        //喜欢分享
        addLikeClick: function (b, c) {
            var data = {
                'share_id' : c
            };
            ajaxget(t.attr('data-likeshare-url'),data,function(result){
                var data = $(result.data).children('a');
                //图片详细页喜欢/已喜欢结构替换
                $('.favoriteShare-'+ c).html(data);
                //喜欢数加一
                var like_num =  parseInt($('.favoriteShare-'+c).next('span').html());
                like_num++;
                $('.favoriteShare-'+c).next('span').attr('data-action', 'remLike');
                $('.favoriteShare-'+c).next('span').html(like_num);
            },function(a){
                showError(a.message);
            });
            return !1
        },
        //取消喜欢分享
        remLikeClick: function(b,c){
            var data = {
                'share_id' : c
            }
            ajaxget(t.attr('data-remLike-url'),data,function(result){
                var data = $(result.data).children('a');
                $('.favoriteShare-'+ c).html(data);
                //喜欢数减一
                var like_num =  parseInt($('.favoriteShare-'+c).next('span').html());
                like_num--;
                $('.favoriteShare-'+c).next('span').attr('data-action', 'addLike');
                $('.favoriteShare-'+c).next('span').html(like_num);
            },function(a){
                showError(a.message);
            });
            return !1
        },
        socialShareClick: function (b, c, d) {
            var b = encodeURIComponent("\u62fc\u56fe\u79c0"),
            f = a("#" + c + "_image").find("img"),
            g = "";
            0 < f.length && (g = a(f[0]).attr("orgin_src"));
            var f = a("#" + c + "_image").attr("href"),
            h = a("#" + c + "_image").find(".video_icon");
            0 < h.length && (f = a(h).attr("orgin_url"), g = a(h).attr("orgin_src"));
            c = a("#" + c + " .share_desc").text();
            h = encodeURIComponent(ba(c, 100, "..."));
            f = encodeURIComponent(f);
            g = encodeURIComponent(g);
            "sina" == d ? (b = "http://service.weibo.com/share/share.php?appkey=" + sina_key + "&pic=" + g + "&title=" + h + "&url=" + f + "&relateuid=2664239401", g = z(615, 505), window.open(b, "social_share", g)) : "renren" == d ? (b = "http://share.renren.com/share/buttonshare?link=" + f + "&title=" + h, g = z(626, 436), window.open(b, "social_share", g)) : "qq" == d ? (b = "http://v.t.qq.com/share/share.php?appkey=" + qq_key + "&pic=" + g + "&title=" +
                h + "&source=" + b + "&url=" + f, g = z(642, 468), window.open(b, "social_share", g)) : "qzone" == d ? (d = encodeURIComponent(c), c = encodeURIComponent(ba(c, 30, "...")), b = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?pics=" + g + "&url=" + f + "&title=" + c + "&summary=" + d + "&site=" + b, g = z(634, 668), window.open(b, "social_share", g)) : "twitter" == d ? (b = "https://twitter.com/intent/tweet?original_referer=" + f + "&source=tweetbutton&text=" + h + f + "&url=" + f, g = z(634, 505), window.open(b, "social_share", g)) : "facebook" == d && (b = "http://www.facebook.com/sharer/sharer.php?u=" +
                f, g = z(700, 550), window.open(b, "social_share", g));
                return !1
            },
            addCommentClick: function (b, c, d, f) {
                b = a("#" + c + "_commentbox").val();
                if (null == b || void 0 == b || "" == a.trim(b)) return showError("评论内容不能为空"), !1;
                Q(d, c, b, "comment", void 0 == f || null == f ? !1 : !0);
                return !1
            },
            addDetailCommentClick: function (b, c, d, f) {
                var reply_comment_id = $('#reply_comment_id').val();
                var content = $('#reditor_textarea').val();
                if (null == content || void 0 == content || "" == a.trim(content)) return showError(getTip("not-null")), !1;
                if(reply_comment_id){ // 二级评论
                    commentReply(reply_comment_id,content);
                    //将#reply_comment_id值设为空,表示发表一级评论
                    $('#reply_comment_id').val('');
                }
                else{  // 一级评论
                    Q(d, c, content, "comment", void 0 == f || null == f ? !1 : !0);
                }
                $('#reditor_textarea').val('');
                return !1
            },// todo
            // 顶/踩评论
            commentSupportClick: function(a,comment_id,operation){
                var data = {
                    'comment_id' : comment_id,
                    'do' : operation
                }
                ajaxget(t.attr("data-commentSupport-url"),data,function(result){
                    // 顶/踩 +1，并添加active
                    if(result.data == '1'){
                        $('#support-'+comment_id).text(Number($('#support-'+comment_id).text())+1);
                        $('#support-'+comment_id).parent().addClass('active');
                    }
                    else if(result.data == '2'){
                        $('#nonsupport-'+comment_id).text(Number($('#nonsupport-'+comment_id).text())+1);
                        $('#nonsupport-'+comment_id).parent().addClass('active');
                    }
                    // 取消操作移除active
                    else if(result.data == '0'){ 
                        if(operation == '1'){ // 如果执行的是取消顶操作
                            $('#support-'+comment_id).text(Number($('#support-'+comment_id).text())-1);
                            $('#support-'+comment_id).parent().removeClass('active');
                        }
                        else if(operation == '2'){ // 如果执行的是取消踩操作
                            $('#nonsupport-'+comment_id).text(Number($('#nonsupport-'+comment_id).text())-1);
                            $('#nonsupport-'+comment_id).parent().removeClass('active');

                        }
                    }
                }, function (a) {
                    showError(a.message);
                })
            },
            //删除评论
            delCommentClick: function(b,comment_id){
                var data = {
                    'comment_id' : comment_id
                }
                ajaxget(t.attr('data-delComment-url'),data,function(result){
                   // showSuccess(result.message);
                   $('#comment-'+comment_id).hide(1E3);
                    $('.the-comment .meta-head strong').text(Number($('.the-comment .meta-head strong').text())-1); // 图片详细页评论个数

                },function(a){
                    showError(a.message);
                });
                return !1
            },
            //删除二级评论
            delCommentreplyClick: function(b,reply_id){
                var data = {
                    'reply_id' : reply_id
                }
                ajaxget(t.attr('data-delCommentreply-url'),data,function(result){
                       // showSuccess(result.message);
                       $('#reply-'+reply_id).hide(1E3);
                   },function(a){
                    showError(a.message);
                });
                return !1
            },
            openPushDialogClick: function (a, b, c, d) {
                J = b;
                Y = c;
                S = "home";
                T = t.attr("data-crophotshare-url");
                I = base_url_r + d + "_large.jpg";
                N(b, c);
                return !1
            },
            starSaveClick: function (b, c) {
                var d = a("#" + c),
                f = d.find(".apply_reason").val(),
                g = d.find(".apply_cid").val(),
                h = d.find(".user_id").val();
                if (null == f || void 0 == f || "" == a.trim(f)) return d.find(".error").html(getTip("not-null")), !1;
                v(g, h, f)
            },
            applySaveClick: function (b, c) {
                var d = a("#" + c),
                f = d.find(".apply_reason").val(),
                g = d.find(".apply_cid").val();
                if (null ==
                    f || void 0 == f || "" == a.trim(f)) return d.find(".error").html(getTip("not-null")), !1;
                    d = a("#apply_tpl").attr("data-applytype");
                q(g, f, d)
            },
            applyStoreSaveClick: function (b, c) {
                var d = a("#" + c),
                f = d.find(".apply_reason").val(),
                g = d.find(".apply_sub_cid").val();
                if (null == f || void 0 == f || "" == a.trim(f)) return d.find(".error").html(getTip("not-null")), !1;
                a("#apply_store_tpl");
                q(g, f, "shop")
            },
            // add by allen to recommend 2013-12-3 14:11:42
            recommendStoreSaveClick: function (b,c){
                var f = a("#recommend_name").val(),
                province = a("#province").val(),
                city = a("#city").val(),
                address = a("#address").val(),
                shop_desc = a("#shop_desc").val();
                if (null == f || void 0 == f || "" == a.trim(f)) return a(".error").html(getTip("not-null")), !1;
                f = {
                    recommend_name: f,
                    province : province,
                    city : city,
                    address : address,
                    shop_desc : shop_desc,
                };
                ajaxpost(t.attr('data-recommend-url'), f, function (a){
                    showSuccess(a.message);
                    getStaticDialog().hide()
                },function (a){
                    showError(a.message)
                })
            },
            // end by allen
            cropBtnClick: function () {
                var b = crop_image.getSelection(),
                c = b.x2 - b.x1,
                d = b.y2 - b.y1,
                f = a("#crop_image_" + J).height(),
                g = a("#crop_image_" +
                    J).width();
                L(J, Y, G, b.x1, b.y1, c, d, g, f);
                return !1
            },
            // 标签列表
            listTagsClick: function (b, c, d) {
                if(!a('#all-tag').has('a').length){
                    a(this).html("");
                        a(this).addClass('selected-tag').addClass('clearfix').removeAttr('data-action');
                        a(".more-tag").css('display','block');
                        b = a("." + d);                
                        if(!b.has('a').length){ //如果没有选中任何标签,才能弹出选择标签框
                            f = a("#save_share_form > .category_select_list").attr('data-init');
                            if(f== 1){
                                x(c, b);
                            }else{
                                var album_id = $('#ablum_select_id').val();
                                var f = {
                                        album_id: album_id,
                                        radom: random(5)
                                    };
                                ajaxget(t.attr("data-listTags-url"),f,function(b){
                                    var b = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-action="initTags" data-params="{{tag_name}}" class="box">{{tag_name}}</a></li>{{/data}}', b));
                                    a(".tags_list").html(b);
                                }, function (a) {
                                    showError(a.message);
                                })
                            }                    
                        } 
                }                                  
            },
            // 添加自定义标签
            addTagClick: function(){
                var tag = $('#addTag').val();
                $('#addTag').val('');
                if(a("#all-tag a").length == 4){
                    a("#all-tag").css('overflow-y','scroll');
                }                
                b = '<a href="javascript:void(0);" data-action="removeTags" data-params="'+tag+'">'+tag+'</a>';
                a(".selected-tag").append(b);
                var c = 0;
                a(".selected-tag a").each(function() {
                    //热词前后加逗号以便热词数据库搜索
                    if(c){
                        c = c + ',' + a(this).text();
                    }else{
                        c = a(this).text();
                    }                                
                });
                c = ',' + c + ',';
                a("#tags-input").val(c);
            },
            closeTagClick: function (){
                a(".more-tag").css('display','none');
                a(".tags_list li").remove();
                a(".tags_list").append('<li><span>热门标签：</span></li>');
                a("#all-tag").attr('data-action', 'listTags');
                if(!a("#all-tag").has('a').length){
                    a(".text").removeClass('selected-tag').removeClass('clearfix').append('添加适合的标签，方便大家找到');
                }                
            },
            // add by allen 2013-11-21 11:28:13
            getTagsClick: function (b, c, d){
                var f = {
                    cid: c,
                    radom: random(5)
                };
                ajaxget(t.attr("data-singletags-url"),f,function(b){
                    var b = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-action="initTags" data-params="{{tag_name}}" class="box">{{tag_name}}</a></li>{{/data}}', b));
                    a(".tags_list a").removeAttr("data-action").addClass('active');
                    f = a(".tags_list").html();
                    a(".tags_list").html(b).prepend(f);
                }, function (a) {
                    showError(a.message);
                })
            },
            initTagsClick: function (b,c){
                a(this).removeAttr('data-action').addClass('active');
                if(a("#all-tag a").length == 4){
                    a("#all-tag").css('overflow-y','scroll');
                }                
                b = '<a href="javascript:void(0);" data-action="removeTags" data-params="'+c+'">'+c+'</a>';
                a(".selected-tag").append(b);
                var c = 0;
                a(".selected-tag a").each(function() {
                    //热词前后加逗号以便热词数据库搜索
                    if(c){
                        c = c + ',' + a(this).text();
                    }else{
                        c = a(this).text();
                    }                                
                });
                c = ',' + c + ',';
                a("#tags-input").val(c);
            },
            removeTagsClick: function (b,c){
                a(".tags_list a[data-params*='"+c+"']").removeClass('active').attr('data-action', 'initTags');
                a(this).remove();
                var c = 0;
                a("#all-tag a").each(function() {
                    if(c){
                        c = c + ',' + a(this).text();
                    }else{
                        c = a(this).text();
                    }                                
                });
                a("#tags-input").val(c);
                f = a("#all-tag");
                c = a(".tags_list"); 
                b = 0;              
                if (!f.has('a').length){
                    f = a(".category_select_list").attr('data-init');
                    if( f== 1){
                        var d = a(c),
                        f = {
                            cid: b,
                            radom: random(5)
                        };
                        ajaxget(t.attr("data-simpletag-url"), f, function (b) {
                            var c = d.attr("data-target-id"),
                            b = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-aid="{{tag_id}}" data-action="getTags" data-params="{{tag_id}},{{tag_group_name_cn}}" class="box">{{tag_group_name_cn}}</a></li>{{/data}}', b));
                            d.html(b).prepend('<li><span>热门标签：</span></li>');
                        }, function (a) {
                            showError(a.message)
                        });
                    }else{
                        var f = {
                            cid: f,
                            radom: random(5)
                        };
                        ajaxget(t.attr("data-singletags-url"),f,function(b){
                            var b = a(Mustache.render('{{#data}}<li><a href="javascript:;" data-action="initTags" data-params="{{tag_name}}" class="box">{{tag_name}}</a></li>{{/data}}', b));
                            a(".tags_list a").removeAttr("data-action").addClass('active');
                            a(".tags_list").html(b).prepend('<li><span>热门标签：</span></li>');
                        }, function (a) {
                            showError(a.message);
                        })
                    } 
                }                
            },
            // end by allen
            confirmRedirectClick: function (a, b, c) {
                confirm(getTip("confirm-" + c)) && (window.location.href = b);
                return !1
            },
            // edit by allen 2013-11-22 12:22:07
            albumItemClick: function (a, b, c, d) {
                O(b, c, d)
            },
            // end by allen
            // edit by porter at 2013-12-11 10:50:44
            boardItemClick: function (a, b, c, d) {
                boardItem(b, c, d)
            },
            // end edit
            categoryItemShowClick: function (a, b, c, d) {
               O1(b,c,d)
            },
            categoryItemClick: function (a, b, c, d, f) {
                M(b, c, d, f)
            },
            // edit by allen
            albumItemPopupClick: function (a, b) {
                C(b)
            },
            //end by allen 
            //edit by porter
            boardItemPopupClick: function (a, b) {
                boardItemPopup(b)
            },
            // end edit
            // end edit
            categoryItemPopupShowClick: function (a, b) {
               F(b);
            },
            categoryItemPopupClick: function (a, b) {
                D(b)
            },
            albumListPopupClick: function () {
                j()
            },
            albumPopItemClick: function (b, c, d) {
                b = a("#album_select_div");
                b.hasClass("btn_select_hover") && b.removeClass("btn_select_hover");
                null == c ? (b.find(".album_select_title").html(getTip("pls_select")), b.find(".album_select_id").val("")) :
                (b.find(".album_select_title").html(d), b.find(".album_select_id").val(c))
            },
            categoryListPopupClick: function (a, b) {
                m(b)
            },
            categoryPopItemClick: function (a, b, c) {
                p(b, c, "category_select_div", "album_select_div")
            },
            pushStarCatItemClick: function (a, b, c, d) {
                p(b, c, d, null)
            },
            openCatItemClick: function (a, b, c, d) {
                p(b, c, d, null)
            },
            //edit by allen newalbum 2013-11-22 13:55:05
            albumPopCreateClick: function (a, b, c) {
                if ($(this).siblings('.album_name').val().length == 0) {
                    $(this).siblings('.album_name').css('border-color', 'red').focus();
                    return;
                };
                if ($(this).siblings('.album_name').val().length != 0) {
                    $(this).siblings('.album_name').css('border-color', '#C9C9C9');
                };
                y(b, c)
            },
            switchPublishClick: function (a, b) {
                change_upload_data_url(b)
            },
            switchPushStyleClick: function (a, b) {
                n(b)
            },
            // edit by allen 2013-11-22 11:40:44 
            fetchRemoteClick: function (b, c) {
                var d = a("#remote_url").val();
                // edit by porter at 2013-12-16 15:43:37 禁止抓取diuzhuan的图片
                if(d.indexOf("diuzhuan") > 0){
                    showError("仅支持外部网站抓取，站内请直接收集");
                    a("#web_fecth_content").hide();
                    return;
                }
                // end edit
                if (null ==
                    d || "" == d) return a("#ajax_fetch_message").html("<div class='get_notnull'>链接不能为空</div>"), !1;
                    a("#ajax_fetch_message").html("");
                a("#web_fecth_content").hide();
                k(d, c);
                return !1
            },
            // end by allen
            preImageClick: function () {
                var b;
                b = a("#publish_image_list").find("li.cover");
                var c = a("#publish_image_list").find("li");
                0 == b.length && a("#upload_imgview_div").html("");
                c = a(b).prev().length ? a(b).prev() : c[c.length - 1];
                a(b).removeClass("cover");
                a(c).addClass("cover");
                b = a(c).find("img").attr("src");
                a("#upload_imgview_div").html('<img src="' + b + '"/>');
                a("#cover_filename").val(a(c).attr("data-name"));
                return !1
            },
            nextImageClick: function () {
                l();
                return !1
            },
            fetchFileItemClick: function (b, c) {
                a(this).parent().parent().find("li").removeClass("active");
                a(this).parent().addClass("active");
                a(this).parent().parent().find("i").addClass("hide");
                a(this).parent().find(".active").removeClass("hide");
                a("#filename").val(c);
                return !1
            },
            editFShareOpenClick: function (a, b) {
                d(b, "edit_forwarding", "forwarding_tpl");
                return !1
            },
            editOShareOpenClick: function (a, b) {
                d(b, "edit_item", "edit_item");
                return !1
            },
            editShareClick: function () {
                return !1
            },
            editAlbumClick: function(b,album_id){
                showDialog("edit_album", function () {
                    //传入album_id值
                    var data = {
                        'album_id' : album_id
                    };
                    // 初始化专辑信息
                    ajaxget(t.attr('data-getOneAlbum-url'),data,function(result){
                        $('#album_id').val(result.data.album_id);
                        $('#album_title').val(result.data.album_title);
                        category_list("category",result.data.category_id);
                        $('#album_desc').val(result.data.album_desc);
                    },function(a){
                        showError(a.message);
                    })
                    $('#delAlbum').attr('data-params',album_id); // 初始化删除专辑的data-params
                    a.oValidate("album_edit_form");
                })
                return !1
            },
            //删除空专辑
            delAlbumClick: function(b,album_id){
                var data = {
                    'album_id' : album_id
                }
                ajaxget(t.attr('data-delAlbum-url'),data,function(result){
                    //成功直接在后台跳转至我收藏页面了.          
                  //  showSuccess(result.message);
                  window.location.href = result.data;
              },function(a){
                showError(a.message);
            });
                return !1
            },
            addFollowClick: function (a, b) {
                addFollow(b);
                return !1
            },
            removeFollowClick: function (a, b) {
                g(b);
                return !1
            },
            //关注专辑
            addFavoriteAlbumClick: function(a,album_id) {
                var data = {
                    'album_id': album_id
                };
                ajaxpost(t.attr("data-addFavoriteAlbum-url"), data, function (result) {
                    $("#" + album_id + "-favoriteAlbum").html(result.data)
                }, function (a) {
                    showError(a.message)
                })
            },
            //取消关注专辑
            remFavoriteAlbumClick: function(a,album_id) {
                var data = {
                    'album_id': album_id
                };
                ajaxpost(t.attr("data-remFavoriteAlbum-url"), data, function (result) {
                    $("#" + album_id + "-favoriteAlbum").html(result.data)
                }, function (a) {
                    showError(a.message)
                })
            },
            publishPinItemClick: function () {
                a(this).hasClass("selected") ? a(this).removeClass("selected") : a(this).addClass("selected");
                return !1
            }
        },
        events: "click"
    });
var ba = function (a, b, c) {
    if (a.length <= b) return a;
    for (var d = /https?:\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-_A-Z0-9a-z\$\.\+\!\*\/,:;@&=\?\~\#\%]*)*/gi, f; null != (f = d.exec(a));)
        if (f.index < b && f.index + f[0].length > b) return a.substr(0, f.index + f[0].length) + c;
    return a.substr(0,
        b) + c
}
});
$(document).ready(function (a) {
    var b = a("#waterfall");
    if (null != b && void 0 != b) {
        var c = Number(b.attr("data-pin-width")),
        d = Number(b.attr("data-animated")),
        d = 1 == d ? !0 : !1;
        a(window).resize(function () {
            if (1 == a("#waterfall_outer").attr("data-fullscreen")) {
                var d = 0,
                g = a("#waterfall_outer .scroll-container");
                null != g && void 0 != g && (d = g.width());
                var h = a(this).width(),
                n = Math.floor(h / c) * c,
                k = (h - n + 10) / 2;
                a("#waterfall_outer").css("width", h);
                a("#waterfall").css("width", n - d);
                d ? (g.css("margin-left", k), a("#waterfall").addClass("inside"),
                    a("#waterfall").css("margin-left", 0)) : (a("#waterfall").addClass("inside"), a("#waterfall").css("margin-left", k));
                a("#header").css("width", n);
                a("#userbar").css("margin-right", 20);
                a("#nav-cat").css("width", n);                
            } else if (h = b.width(), n = Math.floor(h / c) * c, g = a("#waterfall_outer .scroll-container"), d = g.width(), null == d || void 0 == d || 0 == d) a("#waterfall_outer").css("width", h), a("#waterfall").css("width", n), a("#waterfall").css("margin-left", (h - n + 10) / 2)
        });
a(window).resize();
a(b).imagesLoaded(function () {
    a(b).find(".pin").fadeIn();
    a(b).find(".pin").removeClass("hide");
    a(b).masonry({
        columnWidth: c,
        isAnimated: d,
        itemSelector: ".pin"
    });
    a("#loadingPins").addClass("hide")
});        
b.infinitescroll({  
    navSelector: "#page-nav",
    nextSelector: "#page-nav a",
    itemSelector: ".pin",
    bufferPx: 500,
    loading: {
        finishedMsg: getTip("load_complete"),
        img: base_url + "Public/Img/puzzle24.gif",
        msg: "test mesg",
        msgText: getTip("loading")
    }
}, function (c) {
    var c = a(c).addClass('hide');
    c.imagesLoaded(function () {
        a(c).fadeIn();
        b.masonry("appended", a(c), !0);
        $("[rel=tooltip]").tooltip({
            animation: !0
        })
    });
            //手机自适应两排显示
            var current_width = $(window).width();
            //do something with the width value here!
            if(current_width < 500){
                $('#waterfall').attr('data-pin-width', '150');
                $('.pin').css({'width':'140px','margin':'0 4px 12px'});
                $(window).resize(function() {
                    if ($('body').width() != current_width && $('body').width() > 500) {
                        location.reload(true);
                    }
                });
            }
            if(current_width >= 500){
                $('#waterfall').attr('data-pin-width', '250');
                $('.pin').css({'width':'234px','margin':'0 7px 14px'});
                $(window).resize(function() {
                    if ($('body').width() != current_width && $('body').width() < 500) {
                        location.reload(true);
                    }
                });
            }
        });
    }
});
$(document).ready(function (a) {
    function b() {
        var b = d.find(".timeline");
        a.each(b, function (b, c) {
            var d = a(c).css("left"),
            f = a(c).find(".corner");
            a(f).html("0px" == d || "auto" == d ? "<span class='right-line'><i class='right-corner'></i><i class='pointer'></i></span>" : "<span class='left-line'><i class='left-corner'></i><i class='pointer'></i></span>")
        });
        c();
        d.find("#page-nav").css("display", "none")
    }

    function c() {
        var b = d.find(".line"),
        c = d.height();
        a(b).css("height", c)
    }
    var d = a("#timeline-box");
    b();
    d.imagesLoaded(function () {
        d.find(".timeline").fadeIn();
        d.find(".timeline").removeClass("hide");
        d.masonry({
            isAnimated: !1,
            itemSelector: ".timeline",
            animationOptions: {
                duration: 300,
                easing: "swing",
                queue: !1
            }
        });
        a("#timeline-loadingPins").addClass("hide");
        setTimeout(function () {
            b()
        }, 500)
    });
    d.infinitescroll({
        navSelector: "#page-nav:last",
        nextSelector: "a#page-next:last",
        itemSelector: ".timeline",
        debug: !1,
        loading: {
            finishedMsg: getTip("load_complete"),
            img: base_url + "/themes/puzzing/img/puzzle24.gif",
            msg: "test mesg",
            msgText: getTip("loading")
        }
    }, function (c) {
        var g = a(c).css({
            opacity: 0
        });
        g.imagesLoaded(function () {
            g.removeClass("hide");
            g.animate({
                opacity: 1
            });
            d.masonry("appended", g, !0);
            setTimeout(function () {
                b()
            }, 500)
        })
    });
    a(".line").mousemove(function (b) {
        b = b.pageY - 540 - 60;
        a(".plus").addClass("plus_bg");
        a(".plus").css({
            top: b + "px"
        })
    }).mouseout(function () {
        a(".plus").removeClass("plus_bg")
    });
    a(".line").click(function (b) {
        a("#popup").css({
            top: b.pageY - 540 - 69 + "px"
        });
        a("#popup").fadeIn();
        a("#update").focus()
    })
});
(function (a) {
    function b() {}
    var c = null;
    a.sclogin = function () {
        c || (c = new b);
        return c
    };
    b.prototype = {
        scrollTimer: null,
        _position: 0,
        startScroll: function () {
            var b = this;
            b._position = a(window).scrollTop();
            b.scrollTimer = setInterval(function () {
                b._position += 5;
                a("body,html").animate({
                    scrollTop: b._position
                }, 220);
                a("body").css("overflow", "hidden")
            }, 220)
        },
        stopScroll: function () {
            this.scrollTimer && (clearInterval(this.scrollTimer), this.scrollTimer = null, a("body, html").clearQueue().stop(!0, !0), a("body").css("overflow", ""))
        },
        start: function () {
            var b = this;
            setTimeout(function () {
                a.oFDialog("puzzDialog") || openLoginDialog(function () {
                    var c = a.oFDialog("puzzDialog");
                    a(c).bind("hide", function () {
                        b.stopScroll()
                    });
                    c.elem.find("input").bind("focus", function () {
                        b.stopScroll()
                    });
                    b.startScroll();
                    setTimeout(function () {
                        b.stopScroll()
                    }, 12E4)
                })
            }, 1E4)
        }
    }
})(jQuery);
(function (a) {
    function b(b, f, g) {
        var h = a("<ul></ul>");
        h.append(c("<<", b, f, g)).append(c("<", b, f, g));
        var n = 1,
        k = 9;
        4 < b && (n = b - 4, k = b + 4);
        k > f && (n = f - 8, k = f);
        for (1 > n && (n = 1); n <= k; n++) {
            var l = a('<li><a href="javascript:;">' + n + "</a></li>");
            n == b ? l.addClass("active") : l.click(function (e) {
                g(this.firstChild.firstChild.data);
                e.stopPropagation();
            });
            l.appendTo(h)
        }
        h.append(c(">", b, f, g)).append(c(">>", b, f, g));
        return h
    }

    function c(b, c, g, h) {
        var n = a('<li><a href="javascript:;">' + b + "</a></li>"),
        k = 1;
        switch (b) {
            case "<<":
            k = 1;
            break;
            case "<":
            k = c - 1;
            break;
            case ">":
            k = c + 1;
            break;
            case ">>":
            k = g
        }
        "<<" == b || "<" == b ? 1 >= c ? n.addClass("disabled") : n.click(function () {
            h(k)
        }) : c >= g ? n.addClass("disabled") : n.click(function () {
            h(k)
        });
        return n
    }
    a.fn.pager = function (c) {
        a.extend({}, a.fn.pager.defaults, c);
        return this.each(function (e) {
            a(this).empty().append(b(parseInt(c.pagenumber), parseInt(c.pagecount), c.buttonClickCallback));
            a(".pages li").mouseover(function () {
                document.body.style.cursor = "pointer"
            }).mouseout(function () {
                document.body.style.cursor = "auto"
            })
        })
    };
    a.fn.pager.defaults = {
        pagenumber: 1,
        pagecount: 1
    }
})(jQuery);