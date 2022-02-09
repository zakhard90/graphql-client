import { reactive } from 'vue';
import moment from 'moment';
export default reactive({
    token: {},
    dataset: {},
    chart: {},
    date: new function () {
        this.from = moment().subtract(10, 'd').toDate();
        this.to = moment().toDate();
        this.range = [this.from, this.to];
    },
    interval: {
        id: "D",
        name: "Daily"
    }
});