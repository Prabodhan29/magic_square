
let solution_state = 0;

//! Display the result
function displayOutput(matrix) {
    for(var i = 0; i < matrix.length; i++) {
        // Get the row1, row2, etc.
        const row = $(".row" + (i+1));

        for(var j = 0; j < matrix[i].length; j++) {
            // Get input element
            const input = $(row.children()[j]); 
            input.val(matrix[i][j]); 
            input.addClass("filled");
            input.removeClass("unfilled");
        }
    }
} 

//! Reload page
function reload_page() {
    window.location.reload();
}

//! Convert array to matrix 
function convert_arr_to_matrix(arr) {
    const n = 10; // don't use arr.length
    let matrix = [];

    let arr_index = 0; 
    for(var i=0; i<n; i++) {
        var temp_row = [];
        for(var j=0; j<n; j++) {
            temp_row.push(arr[arr_index]);
            arr_index++;
        }
        matrix.push(temp_row);
    }
    
    return matrix;
}

//! Check row sum 
function check_row_sum(board, target_sum) {
    for(var i = 0; i < board.length; i++) {
        let row_sum = 0;
        for(var j = 0; j < board[i].length; j++) {
            row_sum += board[i][j]; // row-wise addition
        }
        if (row_sum != target_sum) {
            return false;
        }
    }
    return true;
} 

//! Check column sum 
function check_col_sum(board, target_sum) {
    for(var i = 0; i < board.length; i++) {
        let col_sum = 0;
        for(var j = 0; j < board.length; j++) {
            col_sum += board[j][i]; // column-wise addition
        }
        if (col_sum != target_sum) {
            return false;
        }
    }
    return true;
}

//! Check both diagonal sum 
function check_diag_sum(board, target_sum) {
    let main_diag_sum = 0;
    let anti_diag_sum = 0;
    for(var i = 0; i < board.length; i++) {
        main_diag_sum += board[i][i]; // main diagonal
        anti_diag_sum += board[i][board.length - i - 1]; // anti-diagonal
    }
    if (main_diag_sum != target_sum || anti_diag_sum != target_sum) {
        return false;
    }
    return true;
}


//! Check solution
function check_solution() {
    const TARGET_SUM = 515;

    //? Get all the inputs and convert into 2d array
    const input_arr = [];
    let inputs = $('.element');
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].value == "") 
            input_arr.push(0);
        else 
            input_arr.push(Number(inputs[i].value));
    }
    let board = convert_arr_to_matrix(input_arr);

    //? Check for correctness and display icon 
    if(check_row_sum(board, TARGET_SUM) && check_col_sum(board, TARGET_SUM) && check_diag_sum(board, TARGET_SUM)) {
        dispay_solution_icon(0); // 0 is for correct solution
    }
    else {
        dispay_solution_icon(1); // 1 is for incorrect solution
    }
}


//! Display solution icon
function dispay_solution_icon(sol_type) {
    //? 0 is for correct solution
    //? 1 is for incorrect solution
    if(sol_type == 0) {
        $(".solution").css("display", "block");
        $(".solution img").attr("src", "images/correct.svg");
        setTimeout(function() {
            $(".solution").css("display", "none");
        }, 1000); // remove icon after 1 seconds
    }
    else if(sol_type == 1) {
        $(".solution").css("display", "block");
        $(".solution img").attr("src", "images/wrong.svg");
        setTimeout(function() {
            $(".solution").css("display", "none");
        }, 1000); // remove icon after 1 seconds
    }
}


//! Get inputs and send to Python file
function getSolution() {
    const input_arr = [];
    let inputs = document.querySelectorAll('input');

    //? Fill the array with input values
    for(var i=0; i<inputs.length; i++) {
        if(inputs[i].value == "") 
            input_arr.push(0);    
        else 
            input_arr.push(Number(inputs[i].value));
    }  
    
    //? Show the loader before sending the request to Python backend
    $(".loader").css("display", "grid");
    
    //! Sending input_arr to Python backend using fetch
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input_arr)  
    })
    .then(response => response.json()) //? this runs after the Python file responds
        .then(result => {
            //? Once the response has come (solution), hide the loader
            $(".loader").css("display", "none");
            $(".unfilled").prop("disabled", true); // disable all the inputs
            displayOutput(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}











