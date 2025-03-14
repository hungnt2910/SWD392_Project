export const formatMoney = (money: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(money);
};

export const formatDate = (date: string | Date) => {
    const dateFormated = new Date(date).toLocaleString()
    return dateFormated
}