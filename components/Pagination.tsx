import styles from "../styles/pagination.module.scss";
import React from "react";

type PaginationProps = {
    totalCount: number,
    pageSize: number,
    currentPage: number,
    onChangePage: (pageNumber: number) => void
}

const Pagination: React.FC<PaginationProps> = ({pageSize, totalCount, currentPage, onChangePage}) => {
    const pageCount = Math.ceil(totalCount / pageSize)

    const pages: number[] = []
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i)
    }

    const leftBtn: Array<JSX.Element> = []
    const rightBtn: Array<JSX.Element> = []

    for (let i = 1; i <= 2; i++) {
        if (currentPage + i < pages.length) {
            rightBtn.push(<button key={i} onClick={() => onChangePage(currentPage + i)}>{currentPage + i}</button>)
        }
        if (currentPage - i > 0) {
            leftBtn.unshift(<button key={i} onClick={() => onChangePage(currentPage - i)}>{currentPage - i}</button>)
        }
    }

    return (
        <div className={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => onChangePage(currentPage - 1)}>
                <img src="/pagination-prev.svg" alt="prev"/>
            </button>
            {currentPage > 3 && <button onClick={() => onChangePage(1)}>1</button>}
            {currentPage > 4 && <p>...</p>}
            {
                <>
                    {leftBtn}
                    <button className={styles.active}>{currentPage}</button>
                    {rightBtn}
                </>
            }
            {currentPage + 3 < pages.length && <p>...</p>}
            {currentPage < pages.length && <button onClick={() => onChangePage(pages.length)}>{pages.length}</button>}
            <button disabled={currentPage === pages.length} onClick={() => onChangePage(currentPage + 1)}>
                <img src="/pagination-next.svg" alt="next"/>
            </button>
        </div>
    );
};

export default Pagination;