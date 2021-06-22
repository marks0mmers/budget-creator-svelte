import type { ExpenseSource } from "./expense-source";

export class ExpenseSourceTree {
    private categoriesToExpenseSources = new Map<string, number[]>();
    private categorySubCategoryToExpenseSources = new Map<string, number[]>();

    private collapsedCategories = new Map<string, boolean>();
    private collapsedSubCategories = new Map<string, boolean>();

    constructor(private expenseSources: Map<number, ExpenseSource>) {
        for (let [sourceId, source] of expenseSources) {
            if (source.subCategory) {
                this.categorySubCategoryToExpenseSources =
                    this.categorySubCategoryToExpenseSources.set(
                        `${source.category.id}-${source.subCategory.id}`,
                        [
                            ...(this.categorySubCategoryToExpenseSources.get(
                                `${source.category.id}-${source.subCategory.id}`,
                            ) ?? []),
                            sourceId,
                        ],
                    );
                this.collapsedSubCategories.set(
                    `${source.category.id}-${source.subCategory.id}`,
                    false,
                );
            } else {
                this.categoriesToExpenseSources = this.categoriesToExpenseSources.set(
                    source.category.id.toString(),
                    [
                        ...(this.categoriesToExpenseSources.get(source.category.id.toString()) ??
                            []),
                        sourceId,
                    ],
                );
                this.collapsedCategories.set(source.category.id.toString(), false);
            }
        }
    }

    public getSources(categoryId: number, subCategoryId?: number) {
        if (subCategoryId) {
            return this.categorySubCategoryToExpenseSources
                .get(`${categoryId}-${subCategoryId}`)
                ?.map((id) => this.expenseSources.get(id)!);
        }
        return this.categoriesToExpenseSources
            .get(categoryId.toString())
            ?.map((id) => this.expenseSources.get(id)!);
    }

    public isCollapsed(categoryId: number, subCategoryId?: number) {
        if (subCategoryId) {
            return this.collapsedSubCategories.get(`${categoryId}-${subCategoryId}`);
        } else {
            return this.collapsedCategories.get(categoryId.toString());
        }
    }

    public toggleCollapsed(categoryId: number, subCategoryId?: number) {
        if (subCategoryId) {
            this.collapsedSubCategories = this.collapsedSubCategories.set(
                `${categoryId}-${subCategoryId}`,
                !this.collapsedSubCategories.get(`${categoryId}-${subCategoryId}`),
            );
        } else {
            this.collapsedCategories = this.collapsedCategories.set(
                categoryId.toString(),
                !this.collapsedCategories.get(categoryId.toString()),
            );
        }
        return this;
    }

    public expandAll() {
        [...this.collapsedCategories.keys()].forEach((key) => {
            this.collapsedCategories = this.collapsedCategories.set(key, false);
        });
        [...this.collapsedSubCategories.keys()].forEach((key) => {
            this.collapsedSubCategories = this.collapsedSubCategories.set(key, false);
        });
        return this;
    }

    public collapseAll() {
        [...this.collapsedCategories.keys()].forEach((key) => {
            this.collapsedCategories = this.collapsedCategories.set(key, true);
        });
        [...this.collapsedSubCategories.keys()].forEach((key) => {
            this.collapsedSubCategories = this.collapsedSubCategories.set(key, true);
        });
        return this;
    }
}
