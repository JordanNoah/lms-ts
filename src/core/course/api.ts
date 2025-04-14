import { PluginAPI } from "../http/pluginApi";
import CategoryCourseDto from "./dto/category.dto";
import CourseCoreService from "./service";

const courseRoutes: PluginAPI = {
    prefix: '/course',
    routes: [
        {
            method: 'POST',
            path: '/list',
            handler: async (c) => {
                try {
                    const { page, limit, sorting, search } = await c.req.json();
                    
                    return c.json(await c.req.json());
                } catch (error: any) {
                    return c.json({ error: error.message }, 500);
                }
            }
        },
        {
            method: 'POST',
            path: '/',
            handler: async (c) => {
                try {
                    const courseDto = await c.req.json();
                    return c.json(courseDto);
                } catch (error: any) {
                    return c.json({ error: error.message }, 500);
                }
            }
        },
        {
            method: 'POST',
            path: '/category',
            handler: async (c) => {
                try {                    
                    const [error,categoryDto] = CategoryCourseDto.create(await c.req.json())
                    if (error) return c.json({ error }, 400)
                    
                    return c.json(await new CourseCoreService().createUpdateCategory(categoryDto!));
                } catch (error: any) {
                    return c.json({ error: error.message }, 500);
                }
            }
        },
        {
            method:'PUT',
            path: '/category',
            handler: async (c) => {
                try {
                    const categoryDto = await c.req.json();
                    return c.json(categoryDto);
                } catch (error: any) {
                    return c.json({ error: error.message }, 500);
                }
            }
        },
        {
            method: 'POST',
            path: '/category/list',
            handler: async (c) => {
                try {
                    const { page, limit, sorting, search } = await c.req.json();
                    
                    return c.json(await c.req.json());
                } catch (error: any) {
                    return c.json({ error: error.message }, 500);
                }
            }
        }
    ]
}

export default courseRoutes