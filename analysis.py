from ortools.sat.python import cp_model # type: ignore

#! Create a 2D board from the input_arr
def createBoard(arr):
    n = 10
    board = []
    arr_index = 0
    for i in range(n):
        temp_row = []
        for j in range(n):
            temp_row.append(arr[arr_index])
            arr_index += 1
        board.append(temp_row)

    return board    


#! Solve the magic square
def solve_magic_square(input_arr):
    model = cp_model.CpModel()

    n = 10
    target_sum = 515  
    
    # Pre-filled values on the board
    # pre_filled = [
    #     [93, 0, 2, 0, 16, 68, 0, 52, 0, 41],
    #     [99, 0, 8, 0, 17, 74, 0, 58, 0, 42],
    #     [5, 0, 89, 0, 23, 55, 0, 64, 0, 48],
    #     [86, 0, 20, 0, 4, 61, 0, 70, 0, 29],
    #     [87, 0, 26, 0, 10, 62, 0, 76, 0, 35],
    #     [18, 0, 77, 0, 91, 43, 0, 27, 0, 66],
    #     [24, 0, 83, 0, 92, 49, 0, 33, 0, 67],
    #     [80, 0, 14, 0, 98, 30, 0, 39, 0, 73],
    #     [11, 0, 95, 0, 79, 36, 0, 45, 0, 54],
    #     [12, 0, 101, 0, 85, 37, 0, 51, 0, 60]
    # ]
    pre_filled = createBoard(input_arr)
    
    # Define the board (10x10 grid of variables)
    board = [[model.NewIntVar(1, 101, f'cell_{i}_{j}') for j in range(n)] for i in range(n)]

    # Add constraints for pre-filled values
    for i in range(n):
        for j in range(n):
            if pre_filled[i][j] != 0:
                model.Add(board[i][j] == pre_filled[i][j])

    for i in range(n):
        model.Add(sum(board[i][j] for j in range(n)) == target_sum)  #? Row constraint
        model.Add(sum(board[j][i] for j in range(n)) == target_sum)  #? Column constraint

    model.Add(sum(board[i][i] for i in range(n)) == target_sum)  #? Main diagonal
    model.Add(sum(board[i][n - i - 1] for i in range(n)) == target_sum)  #? Anti-diagonal

    #? Number used are distinct
    all_cells = [board[i][j] for i in range(n) for j in range(n)]
    model.AddAllDifferent(all_cells)

    solver = cp_model.CpSolver()
    solver.parameters.enumerate_all_solutions = False
    solver.parameters.max_time_in_seconds = 100.0
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE or status == cp_model.INFEASIBLE:
        print("Solution found:")
        print("Solution found:")
        result_board = []
        for i in range(n):
            result_board.append([solver.Value(board[i][j]) for j in range(n)])
            
        return result_board

    else:
        print("No solution found.")
        


