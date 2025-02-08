import { Errors } from "moleculer";
const { MoleculerError } = Errors;
import type { Context, Service, ServiceSchema } from "moleculer";
import DbService from "moleculer-db";
import MongooseAdapter from "moleculer-db-adapter-mongoose";
import { QuestionModel } from "../models/question.schema";

export type ActionHelloParams = {
    // name: string;
};

type ServiceSettings = {
    defaultName: string;
};

type ServiceMethods = {
    // uppercase(str: string): string;
};

type ServiceThis = Service<ServiceSettings> & ServiceMethods;

const questionService: ServiceSchema<ServiceSettings, ServiceThis> = {
    name: "question",

    /**
     * Settings
     */
    settings: {
        defaultName: "Moleculer",
    },

    /**
     * Mixins
     */
    mixins: [DbService],

    adapter: new MongooseAdapter(process.env.MONGO_URI_CLOUD || "mongodb://localhost/moleculer"),

    model: QuestionModel,

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getQuestion: {
            rest: "GET /:id",
            params: {
                id: "string",
            },
            async handler(ctx: Context<{ id: string }>) {
                const { id } = ctx.params;
                const question = await this.adapter.findById(id);
                if (!question) {
                    throw new MoleculerError("Question not found", 404);
                }
                return question;
            },
        },
        get: {
            visibility: "private",
        },
        create: {
            rest: "POST /",
            params: {
                discord_id: "string",
                question_text: "string",
                skill: "string",
            },
            async handler(
                ctx: Context<{
                    discord_id: string;
                    question_text: string;
                    skill: string;
                }>,
            ) {
                const { discord_id, question_text, skill } = ctx.params;
                const question = await this.adapter.insert({
                    discord_id,
                    question_text,
                    skill,
                });
                return question;
            },
        },
        update: {
            rest: "PUT /:id",
            params: {
                id: { type: "string" },
                answered: { type: "boolean", optional: true },
                collaboration_id: { type: "string", optional: true },
            },
        },
    },

    /**
     * Events
     */
    events: {},

    /**
     * Methods
     */
    methods: {},

    /**
     * Service created lifecycle event handler
     */
    created() {
        this.logger.info(`The ${this.name} service created.`);
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.logger.info(`The ${this.name} service started.`);
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        this.logger.info(`The ${this.name} service stopped.`);
    },
};

export default questionService;
