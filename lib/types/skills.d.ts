export declare function skillsAction(opts: {
    action: string;
    skill?: string;
}, ctx: any): Promise<{
    skills: string[];
    action: string;
    created?: undefined;
    skill?: undefined;
    status?: undefined;
} | {
    created: string;
    action: string;
    skills?: undefined;
    skill?: undefined;
    status?: undefined;
} | {
    action: string;
    skill: string | undefined;
    status: string;
    skills?: undefined;
    created?: undefined;
}>;
//# sourceMappingURL=skills.d.ts.map