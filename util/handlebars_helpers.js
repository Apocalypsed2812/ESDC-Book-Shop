const helpers = {
    change_number: (number) => {
        let num = formatNumber(number)
        return num
    },

    pagination_product_index: (count, page) => {
        // let body = `<li class="page-item"><a class="page-link" href="/user/book?page=${page == 0 ? 0 : page - 1}">Previous</a></li>`
        // let number_page = (count % 8 === 0) ?  Math.floor(count / 8) : Math.floor(count / 8) + 1
        // for(let i = 0; i < number_page; i ++){
        //     body += `<li class="page-item"><a class="page-link" href="/user/book?page=${i}">${i}</a></li>`
        // }
        // body += `<li class="page-item"><a class="page-link" href="/user/book?page=${page == number_page ? number_page : page + 1}">Next</a></li>`
        // return body
        let body = `<li class="pagination-item">
                        <a href="/?page=${page == 0 ? 0 : page - 1}" class="pagination-item__link">
                            <i class="pagination-item__icon fas fa-angle-left"></i>
                        </a>
                    </li>`
        let number_page = (count % 10 === 0) ?  Math.floor(count / 10) : Math.floor(count / 10) + 1
        for(let i = 0; i < number_page; i ++){
            body += ` <li class="pagination-item pagination-item--active">
                            <a href="/?page=${i}" class="pagination-item__link">
                                ${i}
                            </a>
                        </li>`
        }
        body += `<li class="pagination-item">
                    <a href="/?page=${page == number_page ? number_page : page + 1}" class="pagination-item__link">
                        <i class="pagination-item__icon fas fa-angle-right"></i>
                    </a>
                </li>`
        return body
    },

    pagination_product_user: (count, page) => {
        let body = `<li class="pagination-item">
                        <a href="/user/home?page=${page == 0 ? 0 : page - 1}" class="pagination-item__link">
                            <i class="pagination-item__icon fas fa-angle-left"></i>
                        </a>
                    </li>`
        let number_page = (count % 10 === 0) ?  Math.floor(count / 10) : Math.floor(count / 10) + 1
        for(let i = 0; i < number_page; i ++){
            body += ` <li class="pagination-item pagination-item--active">
                            <a href="/user/home?page=${i}" class="pagination-item__link">
                                ${i}
                            </a>
                        </li>`
        }
        body += `<li class="pagination-item">
                    <a href="/user/home?page=${page == number_page ? number_page : page + 1}" class="pagination-item__link">
                        <i class="pagination-item__icon fas fa-angle-right"></i>
                    </a>
                </li>`
        return body
    },

    formatNumber: (number) => {
        let num = format_number(number)
        num = num + ',000'
        return num
    },
}
function format_number(num) {
    let dollarUSLocale = Intl.NumberFormat("en-US");
    let number = dollarUSLocale.format(parseInt(num));
    return number;
}
module.exports = helpers