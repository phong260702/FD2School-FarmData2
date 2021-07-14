let CustomTableComponent = {
    template:`<div class="sticky-table">
                    <table data-cy="custom-table" style="width:100%" class="table table-bordered table-striped">
                        <thead>
                            <tr class="sticky-header table-text">
                                <th v-if="isVisible[index]" data-cy="headers" v-for="(header, index) in headers">{{ header }}</th>
                                <th data-cy="edit-header" width=55 v-if="canEdit">Edit</th>
                                <th data-cy="delete-header" width=55 v-if="canDelete">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="table-text" data-cy="object-test" v-for="(row, index) in rows">
                                <td v-if="isVisible[itemIndex]" data-cy="table-data" v-for="(item, itemIndex) in row.data">
                                    <div v-if="!(rowToEdit==index) || inputType[itemIndex].type == 'no input'" v-html="item"></div>
                                    
                                    <textarea data-cy="test-input" v-if="rowToEdit==index && inputType[itemIndex].type == 'text'" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)"></textarea>
                                    
                                    <select data-cy="dropdown-input" v-if="rowToEdit==index && inputType[itemIndex].type == 'dropdown'" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)">
                                        <option v-for="option in inputType[itemIndex].value">{{ option }}</option>
                                    </select>
                                    
                                    <input data-cy="date-input" type="date" v-if="rowToEdit==index && inputType[itemIndex].type == 'date'" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)">
                                    
                                    <input data-cy="number-input" type="number" style="width: 70px;" v-if="rowToEdit==index && inputType[itemIndex].type == 'number'" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)">
                                </td>
                                <td v-if="canEdit"> 
                                    <button class="table-button btn btn-info" data-cy="edit-button" @click="editRow(index)" v-if="!(rowToEdit==index)" :disabled="editDeleteDisabled"><span class="glyphicon glyphicon-pencil"></span></button> 
                                    <button class="table-button btn btn-success" data-cy="save-button" v-if="rowToEdit==index" @click="finishRowEdit(row.id, row)"><span class="glyphicon glyphicon-check"></span></button>
                                </td>
                                <td v-if="canDelete"> 
                                    <button class="table-button btn btn-danger" data-cy="delete-button" @click="deleteRow(row.id)" :disabled="editDeleteDisabled"><span class="glyphicon glyphicon-trash"></span></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>`,
    props: { 
        rows: {
            type: Array,
            required: true
        },
        headers: {
            type: Array,
            required: true
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        canDelete: {
            type: Boolean,
            default: false
        },
        visibleColumns: {
            type: Array,
            default: null
        },
        inputOptions: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            rowToEdit: null,
            indexesToChange: [],
        }
    },
    methods: {
        editRow: function(index){
            this.rowToEdit = index
            this.$emit('edit-clicked')
        },
        finishRowEdit: function(id, row){
            this.rowToEdit = null
            let jsonObject = {}
            for(i=0; i < this.indexesToChange.length; i ++){
                let key = this.headers[this.indexesToChange[i]]
                jsonObject[key] = row.data[this.indexesToChange[i]]
            }
            this.indexesToChange = []

            this.$emit('row-edited', jsonObject, id)
        },
        deleteRow: function(id){
            this.$emit('row-deleted', id)
        },
        changedCell: function(itemIndex){
            if(!this.indexesToChange.includes(itemIndex)){
                this.indexesToChange.push(itemIndex)
            }
        }
    },
    computed: {
        editDeleteDisabled() {
            if (this.rowToEdit != null){
                return true
            }else{
                return false
            }
        },
        isVisible() {
            let updatedVis = []
            if (this.visibleColumns == null) {
                for (i = 0; i < this.headers.length; i++) {
                    updatedVis.push(true);
                }
            }
            else {
                updatedVis = this.visibleColumns
            }
            return updatedVis;
        },
        inputType() {
            let typeArray = []
            if (this.inputOptions == null) {
                for (i = 0; i < this.headers.length; i++) {
                    typeArray.push({'type': 'text'});
                }
            }
            else {
                typeArray = this.inputOptions
            }
            return typeArray;
        }
    }
}

try {
    module.exports = {
        CustomTableComponent: CustomTableComponent
    }
}
catch {}