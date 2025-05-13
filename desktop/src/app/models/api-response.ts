export interface ApiResponse<T> {
    success: boolean,
    errorMessage: string | null,
    data: T
}
