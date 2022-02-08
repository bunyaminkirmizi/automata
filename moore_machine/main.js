class Edge{
    constructor(in_val,out_node){
        this.in_val = in_val;
        this.out_node = out_node;
    }
    get_next_node(){
        return this.out_node
    }
}

class Node{
    constructor(index,out) {
    this.state_num = index;
    this.out = out;
    this.edges= new Array();
    }
    set_edge(edge) {
        this.edges.push(edge)
    }
    set_output(out){
        this.out = out;        
    }
    get_out_value(){
        return this.out;
    }
    get_edge(for_input){
        let el = null
        this.edges.forEach(element => {
            if(element.in_val == for_input){
                el = element
            }
        });
        return el
    }
  }

class Machine{
    constructor(
        number_of_states,
        input_alphabet,
        output_alphabet,
        transition_table) {
            this.number_of_states = number_of_states
            this.input_alphabet = input_alphabet
            this.output_alphabet = output_alphabet
            this.transition_table = transition_table

            this.state = new Array()
            for (let index = 0; index < number_of_states; index++) {
                this.state.push(new Node(index));
            }
            this.build()
    }
    build(){
        for (let index = 0; index < this.number_of_states; index++) {
            const element = this.transition_table[index];
            
            for (let jindex = 0; jindex < this.input_alphabet.length; jindex++) {
                const input = this.input_alphabet[jindex]
                const output = element[input][0]
                const next = element[input][1]
                const out_state = this.state[next]

                console.log(`${index} nodeuna giris ${input} ise cikis ${output} ve git: ${next}`);
                const edge = new Edge(input,out_state)
                this.state[index].set_output(output)
                this.state[index].set_edge(edge)
            }
        }
    }
    run(input){
        input = [...input]
        let output = ''
        let iter_state = this.state[0]
        for (let index = 0; index < input.length; index++) {
            const element = input[index];
            if(this.input_alphabet.includes(element)){
                console.log(`${element} validation check ok`)
            }else{
                return `Invalid values: Your alphabet = ${this.input_alphabet} please enter valid values`
            }
        }

        if(input == "" || input == null){
            for (let index = 0; index < this.input_alphabet.length; index++) {
                const e = this.input_alphabet[index];
                    document.getElementById(`out-${e}`).className=""
            }

            for (let index = 0; index < this.state.length; index++) {
                const e = this.state[index];
                if(index == 0){
                    document.getElementById(`q${index}`).className="bg-primary"
                }else{
                    document.getElementById(`q${index}`).className=""
                }
                    
            }

            return `Enter values from alphabet = ${this.input_alphabet} your output will be here`;
        }

        document.getElementById('q0').className="bg-primary"

        input.forEach(element => {

            output += iter_state.out
            for (let index = 0; index < this.input_alphabet.length; index++) {
                const e = this.input_alphabet[index];
                if(e != element){
                    document.getElementById(`out-${e}`).className=""
                }
            }

            
            document.getElementById(`out-${element}`).className="bg-danger"

            let edgetonext = iter_state.get_edge(element)
            if(edgetonext == null){
                console.log("ERROR INPUT VALUES NOT IN ALPHABET",iter_state,element,edgetonext);
                return "ERROR INPUT VALUES NOT IN ALPHABET"
            }

            
            iter_state = edgetonext.out_node

            for (let index = 0; index < this.state.length; index++) {
                const e = this.state[index];
                if(e != iter_state){
                    document.getElementById(`q${index}`).className=""
                }else{
                    document.getElementById(`q${index}`).className="bg-primary"
                }
            }
        });

        return output+iter_state.out
    }
  }

class Page{
    constructor(){

    }
}
number_of_states = 0

input_alphabet = []
output_alphabet = []

transition_table = {

}

/*
Transition table format
{
    state as <int>:{
        first input as <str> :[output as <str>,state as <int>]
        second input as <str> :[output as <str>,state as <int>]
        ...
    }
    state as <int>:{
        first input as <str> :[output as <str>,state as <int>]
        second input as <str> :[output as <str>,state as <int>]
        ...
    }
    ...
}
*/
moore_machine=null

function gen_table_row(args) {
    let row = '<tr>'
    for (let index = 0; index < args.length; index++) {
        const element = args[index];
        if(index == 0){
            row+= `<th scope="row">${element}</th>`
        }else{
            row+=`<td>${element}</td>`
        }
    }
    row+='</tr>'
    return row
}
function gen_option_menu(args,id){
  let menu = `<select id="${id}" class="form-select form-select-sm" aria-label=".form-select-sm example">`
    args.forEach(element => {
        menu+=`<option value="${element}">${element}</option>`
    });
  menu +="</select>"
  return menu
}
function gen_table_head_elements(args){
    let row  = '<thead class="table-dark">'
    args.forEach(element => {
        row+= `<th scope="col">${element}</th>`
    });
    row+='</thead>'
    return row
}
function range(start, end) {
    let ans = [];
    for (let i = start; i < end; i++) {
        ans.push(i);
    }
    return ans;
}

function gen_table_option(table_name,number_of_states,alphabet){
    table = `<table class="table">
    <thead class="table-dark">
        <th class="text-center" scope="col" colspan="100">${table_name}</th>
    </thead>
    ${gen_table_head_elements(["STATES",...alphabet])}
    <tbody>`
    for (let index = 0; index < number_of_states; index++) {
        let optable = new Array()
        for (let j = 0; j < alphabet.length; j++) {
            let id = `T${index}${alphabet[j]}`
            optable.push(gen_option_menu(range(0,number_of_states),id))
        }
        table+=gen_table_row([index,...optable])
    }   
    
    table+='</tbody></table>'
    return table
}

function gen_table_option_output(table_name,number_of_states,alphabet,alp_output){
    table = `<table class="table">
    <thead class="table-dark">
        <th class="text-center" scope="col" colspan="100">${table_name}</th>
    </thead>
    ${gen_table_head_elements(["STATES","OUTPUT"])}
    <tbody>`
    for (let index = 0; index < number_of_states; index++) {
        let optable = new Array()
            let id = `O${index}`
            optable.push(gen_option_menu(alp_output,id))
        table+=gen_table_row([index,...optable])
    }   
    
    table+='</tbody></table>'
    return table
}
function build_transition_table(number_of_states,input_alphabet){
    transition_table_json = {}
    for (let index = 0; index < number_of_states; index++) {
        transition_table_json[index] = null
        input_json = {}
        input_alphabet.forEach(element => {
            let output_value = String(document.getElementById(`O${index}`).value)
            console.log(document.getElementById(`O${index}`).value)
            let output_state = parseInt(document.getElementById(`T${index}${element}`).value)
            input_json[element] = [output_value,output_state]
        })
        transition_table_json[index] = input_json
    }
    return transition_table_json
}
function change_transition_table(){
    transition_table = build_transition_table(number_of_states,input_alphabet)
    moore_machine = new Machine(number_of_states,
        input_alphabet,
        output_alphabet,
        transition_table)
    
    moore_machine.build()
}
function test (){
    newtable = gen_table_option("TRANSITION TABLE",number_of_states,input_alphabet)
    document.getElementById("table-main").innerHTML = newtable
    newtable = gen_table_option_output("OUTPUT TABLE",number_of_states,input_alphabet,output_alphabet)
    document.getElementById("table-main").innerHTML += newtable
    change_transition_table()

}
test()
input = document.getElementById("inputState")
input.addEventListener('input', updateValue);


function updateValue(e) {
    console.log(e.target.value)
    number_of_states = e.target.value
    test()
  }
  input2 = document.getElementById("inputInputAlphabet")
  input2.addEventListener('input', updateValue2);
  
  
  function updateValue2(e) {
      console.log(e.target.value)
      input_alphabet = e.target.value.split(",")
      test()
    }


    input3 = document.getElementById("inputOutputAlphabet")
    input3.addEventListener('input', updateValue3);
    
    
    function updateValue3(e) {
        console.log(e.target.value)
        output_alphabet = e.target.value.split(",")
        test()
      }




      function updateValue4(e) {
        console.log(e.target.value)
        
        document.getElementById("runOutput").value = moore_machine.run(e.target.value)
      }
function build_machine_and_show_transition_table(){
    transition_table = build_transition_table(number_of_states,input_alphabet)
    moore_machine = new Machine(number_of_states,input_alphabet,output_alphabet,transition_table)
    let run = `          <form class="row g-3">
    <div class="col-12">
      <label for="inputPassword2" class="visually-hidden"></label>
      <input
        type="text"
        class="form-control text-center"
        id="inputRun"
        placeholder="Input for machine like 010101 "
      />
    </div>
    <div class="col-12">
      <label for="staticEmail2" class="visually-hidden">Email</label>
      <input
        type="text"
        readonly
        class="form-control-plaintext text-center"
        id="runOutput"
        value="Output will be here"
      />
    </div>`
    document.getElementById("main").innerHTML = run + generate_tt_run()
    moore_machine.run("")
    input4 = document.getElementById("inputRun")
    input4.addEventListener('input', updateValue4);
}

function generate_tt_run(){
    headinput = `<th scope="col">OLD STATE</th>`
    new_state_output = '<th scope="col">OUTPUT</th><th scope="col">NEW STATE</th>'.repeat(input_alphabet.length)
    input_alphabet.forEach(element => {
        
        headinput += `<th id="out-${element}" scope="col">After Input  ${element}</th>`
    });
    headinput += `<th scope="col">Character Printed</th>`

    let tr_elements =''
    for (let index = 0; index < this.number_of_states; index++) {
        const element = this.transition_table[index];
        tr_elements += `<tr id="q${index}">
        <th scope="row">q${index}</th>
        `
        let output = ''
        for (let jindex = 0; jindex < this.input_alphabet.length; jindex++) {
            const input = this.input_alphabet[jindex]
            output = element[input][0]
            const next = element[input][1]
            console.log(tr_elements)
            tr_elements += `
            <td>q${next}</td>`;
        }
        tr_elements += `<td>${output}</td>`
        tr_elements += `</tr>`
    }
    let tt =`<table class="table table-bordered text-center">
    <thead class="thead-dark">
      <tr>
        <th scope="col" colspan="100">Transition Table and Output Table</th>
      </tr>
    </thead>
    <thead>
      <tr>
        ${headinput}
      </tr>

    </thead>
    <tbody>
        ${tr_elements}
    </tbody>
  </table>  <small class="text-primary">&#x25A0; blue color stands for current state<br>
  </small>
  <small class="text-danger">&#x25A0; red color stands for last input that you've entered<br>
  </small>`

  return tt
}