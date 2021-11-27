/**
 * Edge bir giris degeri ve bir cikis degeri var
 * ve gittigi nodeu bulunduryor
 * get_next_node() edge in gitti nodu u donduruyor
 * get_out_value() edge in output degerini donduruyor
*/
class Edge{
    constructor(in_val,out_val,out_node){
        this.in_val = in_val;
        this.out_val = out_val;
        this.out_node = out_node;
    }
    get_next_node(){
        return this.out_node
    }
    get_out_value(){
        return this.out_val
    }
}

/*
this.edges[]: bagli oldugu edgeler

get_edge(for_input): for_input degeri icin bagli oldugu tum edgelere bakiyor
bu edgelerin icinde kendine gelen input degerini bulursa bir edge donduruyor

*/
class Node{
    constructor(index) {
    this.state_num = index
      this.edges = [];
    }
    set_edge(edge) {
        this.edges.push(edge)
    }
    get_edge(for_input){
        //check serch input look every edge
        let el = null
        this.edges.forEach(element => {
            if(element.in_val == for_input){
                el = element
            }
        });
        return el
    }
  }

/*
build(): transition table i aliyor ve node[0] dan baslayarak edge ekliyor
mealy machine haline getiriyor

run(): bir input degeri aliyor ve node[0] dan baslayarak makiney calistiriyor
        transition table ustundeki renkleri de burada kontrol ediyorum
*/
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
                const edge = new Edge(input,output,out_state)
                this.state[index].set_edge(edge)
            }
        }
    }
    run(input){
        input = [...input]
        let output = ''
        let iter_state = this.state[0]
        //input validation check
        for (let index = 0; index < input.length; index++) {
            const element = input[index];
            if(this.input_alphabet.includes(element)){
                console.log(`${element} validation check ok`)
            }else{
                return `Invalid values: Your alphabet = {${this.input_alphabet}} please enter valid values`
            }
        }

        if(input == "" || input == null){//if input is empty clear colors
            for (let index = 0; index < this.input_alphabet.length; index++) {
                const e = this.input_alphabet[index];
                    document.getElementById(`out-${e}`).className=""
            }

            for (let index = 0; index < this.state.length; index++) {
                const e = this.state[index];
                    document.getElementById(`q${index}`).className=""
            }
            document.getElementById(`q0`).className="bg-primary"

            return `Enter values from alphabet = ${this.input_alphabet} your output will be here`;
        }

        input.forEach(element => {

            let edgetonext = iter_state.get_edge(element)
            if(edgetonext == null){
                console.log("ERROR INPUT VALUES NOT IN ALPHABET",iter_state,element,edgetonext);
                return "ERROR INPUT VALUES NOT IN ALPHABET"
            }
            
            output += edgetonext.out_val///add to output
            iter_state = edgetonext.out_node///iter node
            

            ////for colors///
            for (let index = 0; index < this.state.length; index++) {
                const e = this.state[index];
                if(e != iter_state){
                    document.getElementById(`q${index}`).className=""
                }else{
                    document.getElementById(`q${index}`).className="bg-primary"
                }
            }

            for (let index = 0; index < this.input_alphabet.length; index++) {
                const e = this.input_alphabet[index];
                if(e != element){
                    document.getElementById(`out-${e}`).className=""
                }else{
                    document.getElementById(`out-${element}`).className="bg-danger"
                }
            }
            ////////
        });

        return output
    }
  }

mealy_machine=null
number_of_states = 0
input_alphabet = []
output_alphabet = []
transition_table = {}

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


//after this line code is about html processing tables inputs buttons etc.
//-----------------------------------------------------------------------------------

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
    ${gen_table_head_elements(["STATES",...alphabet])}
    <tbody>`
    for (let index = 0; index < number_of_states; index++) {
        let optable = new Array()
        for (let j = 0; j < alphabet.length; j++) {
            let id = `O${index}${alphabet[j]}`
            optable.push(gen_option_menu(alp_output,id))
        }
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
            let output_value = String(document.getElementById(`O${index}${element}`).value)
            console.log(document.getElementById(`O${index}${element}`).value)
            let output_state = parseInt(document.getElementById(`T${index}${element}`).value)
            input_json[element] = [output_value,output_state]
        })
        transition_table_json[index] = input_json
    }
    return transition_table_json
}
function change_transition_table(){
    transition_table = build_transition_table(number_of_states,input_alphabet)
    mealy_machine = new Machine(number_of_states,
        input_alphabet,
        output_alphabet,
        transition_table)
    
    mealy_machine.build()
}
function test (){
    newtable = gen_table_option("TRANSITION TABLE",number_of_states,input_alphabet)
    document.getElementById("table-main").innerHTML = newtable
    newtable = gen_table_option_output("OUTPUT TABLE",number_of_states,input_alphabet,output_alphabet)
    document.getElementById("table-main").innerHTML += newtable
    change_transition_table()
    // document.getElementById("table-main").innerHTML += `<button onclick="change_transition_table()" type="button" class="btn btn-primary">Makineyi Oluşutur</button>`

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
        // change_transition_table()
        // test()
        
        document.getElementById("runOutput").value = mealy_machine.run(e.target.value)
      }
function build_machine_and_show_transition_table(){
    transition_table = build_transition_table(number_of_states,input_alphabet)
    mealy_machine = new Machine(number_of_states,input_alphabet,output_alphabet,transition_table)
    let run = `          <form class="row g-3">
    <div class="col-12">
      <label for="inputPassword2" class="visually-hidden"></label>
      <input
        type="text"
        class="form-control text-center"
        id="inputRun"
        placeholder="Input for machine e.g. 010101 "
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
    document.getElementById(`q0`).className="bg-primary"

    input4 = document.getElementById("inputRun")
    input4.addEventListener('input', updateValue4);
}

function generate_tt_run(){
    headinput = ''
    new_state_output = '<th scope="col">OUTPUT</th><th scope="col">NEW STATE</th>'.repeat(input_alphabet.length)
    input_alphabet.forEach(element => {
        headinput += `<th id="out-${element}" scope="col" colspan=2>${element}</th>`
    });
    let tr_elements =''
    for (let index = 0; index < this.number_of_states; index++) {
        const element = this.transition_table[index];
        tr_elements += `<tr id="q${index}">
        <th scope="row">q${index}</th>
        `
        for (let jindex = 0; jindex < this.input_alphabet.length; jindex++) {
            const input = this.input_alphabet[jindex]
            const output = element[input][0]
            const next = element[input][1]
            console.log(tr_elements)
            tr_elements += `
            <td>${output}</td>
            <td>q${next}</td>`
          ;
        }
        tr_elements += `</tr>`
    }
    let tt =`<table class="table text-center table-bordered">
    <thead>
      <tr>
        <th scope="col">#</th>
        ${headinput}
      </tr>
      <tr>
        <th scope="col">OLD STATE</th>
        ${new_state_output}
      </tr>
    </thead>
    <tbody>
        ${tr_elements}
    </tbody>
  </table>
  <small class="text-primary">&#x25A0; blue color stands for current state<br>
</small>
<small class="text-danger">&#x25A0; red color stands for last input that you've entered<br>
</small>`

  return tt
}